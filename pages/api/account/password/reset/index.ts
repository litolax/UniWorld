import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../../../src/server/database'
import { TAccount } from '../../../../../src/types/TAccount'
import * as argon2 from 'argon2'
import { generatePassword } from '../../../../../src/utils'
import nodemailer from 'nodemailer'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const requestBody = req.body
  if (!requestBody) return res.json({})

  const { email, subject, text } = JSON.parse(requestBody) as {
    email: string
    subject: string
    text: string
  }

  const { db } = await connectToDatabase()
  const collection = await db.collection('accounts')

  const account = (await collection.findOne({ email })) as TAccount

  if (!account) {
    return res.status(404).json({})
  }

  const newPassword = generatePassword(10)

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  const mailOptions = {
    from: '"UniWorld" <Uniworld>',
    to: email,
    subject,
    text: text + newPassword,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending reset password email: ', error)
  }

  await collection.updateOne({ email }, { $set: { password: await argon2.hash(newPassword) } })

  return res.status(200).json({})
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API {
  export async function updateAccountLocale(email: string, locale: string): Promise<boolean> {
    const response = await fetch('/api/account/updateLocale', {
      method: 'POST',
      body: JSON.stringify({ email, locale }),
    })

    if (!response.ok) throw new Error(response.statusText)
    return true
  }
}

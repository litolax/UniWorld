import { Button, Result } from 'antd';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Page404() {
	const { t } = useTranslation('errors');
	return (
		<Result
			status='404'
			title='404'
			subTitle={t('pageDoesNotExist')}
			extra={
				<Button type='primary' href={'/'}>
					{t('backHome')}
				</Button>
			}
		/>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale || 'ru', ['errors']))
		}
	};
};
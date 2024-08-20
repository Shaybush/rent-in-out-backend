import { config } from '../../config/config';
import axios from 'axios';

const apiUrl = config.google_api;

export const getUserDetailFromAccessToken = (access_token: string) => {
	return axios.get(`${apiUrl}/oauth2/v1/userinfo?access_token=${access_token}`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
			Accept: 'application/json',
		},
	});
};

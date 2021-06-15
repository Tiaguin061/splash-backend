import ensureAdministrator from '@shared/infra/http/middlewares/ensureAdministrator';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import QRCodeController from '../controllers/QRCodeController';
import UsersController from '../controllers/UsersController';
import UsersPhoneController from '../controllers/UsersPhoneController';
import createUserByPhoneNumberMiddleware from '../middleware/createUserByPhoneNumberMiddleware';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import ensureLimitedCodeRequests from '../middleware/ensureLimitedCodeRequests';

const usersRoutes = Router();

const userPhoneController = new UsersPhoneController();
const qrcodeController = new QRCodeController();
const usersController = new UsersController();

usersRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(1).max(30),
      email: Joi.string().email().max(100),
      password: Joi.when('email', {
        is: Joi.exist(),
        then: Joi.string().min(8).max(100).required(),
      }),
      username: Joi.string()
        .regex(/^[A-Z0-9_.]+$/i)
        .min(1)
        .max(30),
      terms: Joi.boolean(),
      sponsorship_code: Joi.string(),
    },
  }),
  usersController.create,
);

usersRoutes.get(
  '/',
  ensureAuthenticated,
  ensureAdministrator,
  usersController.index,
);
usersRoutes.get('/balance-amount', ensureAuthenticated, usersController.show);

usersRoutes.post(
  '/sms/send-code',
  celebrate({
    [Segments.BODY]: {
      phone_number: Joi.string()
        .regex(/^[0-9]+$/)
        .required(),
    },
  }),
  ensureLimitedCodeRequests,
  userPhoneController.sendCode,
);

usersRoutes.post('/qrcode', qrcodeController.create);

usersRoutes.post(
  '/sms',
  celebrate({
    [Segments.QUERY]: {
      userPhone: Joi.string().regex(/^[0-9]+$/),
    },
    [Segments.BODY]: {
      password: Joi.string().min(8).max(100).required(),
      terms: Joi.boolean().required(),
      verification_code: Joi.string().min(6).max(6).required(),
      sponsorship_code: Joi.string().min(6).max(6).required(),
    },
  }),
  createUserByPhoneNumberMiddleware,
  userPhoneController.create,
);

export default usersRoutes;

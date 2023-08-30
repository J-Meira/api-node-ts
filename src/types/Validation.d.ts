import { RequestHandler } from 'express';
import { ObjectSchema } from 'yup';

export type TProperty = 'body' | 'headers' | 'params' | 'query';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSchemas = Record<TProperty, ObjectSchema<any>>;

export type TValidation = (schemas: Partial<TSchemas>) => RequestHandler;

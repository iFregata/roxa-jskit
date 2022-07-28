import { customAlphabet, nanoid } from 'nanoid/async';
import {
  customAlphabet as nonSecurecustomAlphabet,
  nanoid as nonSecureNanoid,
} from 'nanoid/non-secure';

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const digists = '0123456789';

export const randomURLSafeAsync = async (len: number) => {
  return await nanoid(len);
};

export const randomURLSafe = (len: number) => {
  return nonSecureNanoid(len);
};

export const randomWordsAsync = async (len: number) => {
  const gen = customAlphabet(characters, len);
  return await gen();
};

export const randomWords = (len: number) => {
  const gen = nonSecurecustomAlphabet(characters, len);
  return gen();
};

export const randomNumbersAsync = async (len: number) => {
  const gen = customAlphabet(digists, len);
  return await gen();
};

export const randomNumbers = (len: number) => {
  const gen = nonSecurecustomAlphabet(digists, len);
  return gen();
};

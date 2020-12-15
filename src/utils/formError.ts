import { ValidationError } from "class-validator";
import { Response } from "express";

const formError = (errors: ValidationError[], res: Response): Response => {
  const errorObj = errors.reduce((acc: any, curr: ValidationError) => {
    acc[curr.property] =
      curr.constraints && curr.constraints[Object.keys(curr.constraints)[0]];
    return acc;
  }, {});
  return res.status(400).json(errorObj);
};

export default formError;

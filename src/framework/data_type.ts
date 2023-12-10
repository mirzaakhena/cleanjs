//

type GeneralInfoType<T> = {
  summary?: string;
  description?: string;
  required?: boolean;
  default?: T;
};

export type StringType = GeneralInfoType<string> & {
  type: "string";
  maxLength?: number;
};

export type EnumType = GeneralInfoType<string> & {
  type: "enum";
  enum: string[];
};

export type NumberType = GeneralInfoType<number> & {
  type: "number";
  max?: number;
  min?: number;
};

export type DateType = GeneralInfoType<string> & {
  type: "date";
};

export type PasswordType = GeneralInfoType<string> & {
  type: "password";
};

export type BooleanType = GeneralInfoType<boolean> & {
  type: "boolean";
};

export type TextAreaType = GeneralInfoType<string> & {
  type: "text";
  textAreaLine: number;
};

export type InputType<T = any> = StringType | EnumType | NumberType | BooleanType | DateType | PasswordType | TextAreaType | ObjectType<T> | ArrayType<T>;

export type RecordInputType = Record<string, InputType>;

type ObjectType<T> = GeneralInfoType<any> & {
  type: "object";
  properties: DeepPartial<T>;
};

export type DeepPartial<T, V = InputType<T>> = {
  //
  [K in keyof T]?: T[K] extends object //
    ? T[K] extends Array<any> //
      ? ArrayType<T[K][number]> //
      : ObjectType<T[K]> //
    : V;
};

export type ShallowPartial<T, V = InputType<T>> = {
  //
  [K in keyof T]?: V;
};

export type ArrayType<T> = GeneralInfoType<[]> & {
  type: "array";
  items: StringType | EnumType | NumberType | BooleanType | DateType | TextAreaType | ObjectType<T> | ArrayType<T>;
};

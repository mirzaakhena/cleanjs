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

export type InputType = StringType | EnumType | NumberType | BooleanType | DateType | PasswordType | TextAreaType | ObjectType | ArrayType;

// export type RecordInputType = Record<string, InputType>;

export type ObjectType = GeneralInfoType<any> & {
  type: "object";
  properties: Record<string, InputType>;
};

export type ArrayType = GeneralInfoType<[]> & {
  type: "array";
  items: StringType | EnumType | NumberType | BooleanType | DateType | TextAreaType | ObjectType;
};

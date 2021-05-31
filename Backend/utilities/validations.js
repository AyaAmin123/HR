module.exports = {
  validations: {
    required: (value, name) => {
      const valid =
        value !== undefined &&
        value !== null &&
        value.toString().trim().length > 0;
      return {
        state: valid,
        msg: valid ? "" : `الزاميا ${name} يجب ان يكون `,
      };
    },
    date: (value, name) => {
      const valid =
        value !== undefined &&
        value !== null &&
        /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(value);
      return {
        state: valid,
        msg: valid ? "" : `تاريخ ${name} يجب ان يكون `,
      };
    },
    string: (value, name) => {
      const valid =
        value !== undefined && value !== null && isNaN(value.trim());
      return {
        state: valid,
        msg: valid ? "" : `احرف فقط ${name} يجب ان يكون`,
      };
    },
    number: (value, name) => {
      const valid = value !== undefined && value !== null && !isNaN(value);
      return {
        state: valid,
        msg: valid ? "" : `ارقام فقط ${name} يجب ان يكون `,
      };
    },
    positive: (value, name) => {
      const valid =
        value !== undefined && value !== null && !isNaN(value) && value > 0;

      return {
        state: valid,
        msg: valid ? "" : `اكبر من الصفر ${name} يجب ان يكون `,
      };
    },
    min: (value, name, range) => {
      const valid =
        value !== undefined && value !== null && value.trim().length >= range;
      return {
        state: valid,
        msg: valid ? "" : ` ${range} اكبر من او يساوي ${name} يجب ان يكون  `,
      };
    },
    max: (value, name, range) => {
      const valid =
        value !== undefined && value !== null && value.trim().length <= range;
      return {
        state: valid,
        msg: valid ? "" : ` ${range} اقل من او يساوي ${name} يجب ان يكون  `,
      };
    },
    equal: (left, leftName, right, rightName) => {
      const valid =
        left !== undefined &&
        left !== null &&
        right !== undefined &&
        right !== null &&
        left.trim() === right.trim();
      return {
        state: valid,
        msg: valid ? "" : `${rightName} يساوي ${leftName} لابد من   `,
      };
    },
    nEqual: (left, leftName, right, rightName) => {
      const valid =
        left !== undefined &&
        left !== null &&
        right !== undefined &&
        right !== null &&
        left.trim() !== right.trim();
      return {
        state: valid,
        msg: valid ? "" : `${rightName} ان لا يساوي${leftName} لابد من   `,
      };
    },
    nRequired: (value, name) => {
      return {
        state: value === undefined,
        msg: "",
      };
    },
    object: (value, name) => {
      return {
        state: typeof value === "object" && Object.keys(value).length !== 0,
        msg: "يجب ان يكون object ",
      };
    },
  },
};

import EnvDataType from "../types/EnvDataType.js";

export default class EString extends EnvDataType<string> {
    private ValidatorFunc?: (Env: string) => boolean;

    public Parse(Name: string): string {
        const Env: string | undefined = process.env[Name];
        
        if(Env == undefined) {
            if(!this.DefaultValue)
                throw new TypeError(`Variable ${Name} doesn't exists.`);
            return this.DefaultValue;
        }

        if(this.ValidatorFunc && !this.ValidatorFunc(Env))
            throw new TypeError(`Variable ${Name} failed validator test.`);
        return Env;
    }

    public Default(Value: string): this {
        if(typeof Value !== "string")
            throw new TypeError("Mismatched type between default value and the provided type.");

        if(this.ValidatorFunc && !this.ValidatorFunc(Value))
            throw new TypeError("Value failed validator test.");

        this.DefaultValue = Value;
        return this;
    }

    /**
     * Accepts a validation function that runs before returning.
     */
    public Validator(Validator: (Env: string) => boolean): this {
        this.ValidatorFunc = Validator;
        return this;
    }
}
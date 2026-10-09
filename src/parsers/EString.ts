import EnvDataType from "../EnvDataType.js";

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
        if(Value != undefined && typeof Value !== "string")
            throw new TypeError("Mismatched type between default value and the provided type.");
        this.DefaultValue = Value;
        return this;
    }

    public Validator(Validator: (Env: string) => boolean): this {
        this.ValidatorFunc = Validator;
        return this;
    }
}
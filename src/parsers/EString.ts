import EnvDataType from "../EnvDataType.js";

export default class EString extends EnvDataType<string> {
    public Parse(Name: string): string {
        const Env: string | undefined = process.env[Name];
        
        if(Env == undefined) {
            if(!this.DefaultValue)
                throw new TypeError(`Variable ${Name} doesn't exists.`);
            return this.DefaultValue;
        }
        return Env;
    }

    public Default(Value: string): this {
        if(Value != undefined && typeof Value !== "string")
            throw new TypeError("Mismatched type between default value and the provided type.");
        this.DefaultValue = Value;
        return this;
    }
}
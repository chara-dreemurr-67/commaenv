import EnvDataType from "../types/EnvDataType.js";

export default class EBoolean extends EnvDataType<boolean> {
    public Parse(Name: string): boolean {
        const Env: string | undefined = process.env[Name]?.trim().toLowerCase();

        if(!Env) {
            if(this.DefaultValue == undefined)
                throw new TypeError(`Variable ${Name} doesn't exists.`);
            return this.DefaultValue;
        }

        if(Env === "1" || Env === "true")
            return true;
        if(Env === "0" || Env === "false")
            return false;
        throw new TypeError(`Variable ${Name} isn't a boolean.`);
    }

    public Default(Value: boolean): this {
        if(typeof Value !== "boolean")
            throw new TypeError("Mismatched type between default value and the provided type.");
        this.DefaultValue = Value;
        return this;
    }
}
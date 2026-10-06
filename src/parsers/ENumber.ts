import EnvDataType from "../EnvDataType.js";

export default class ENumber extends EnvDataType<number> {
    public Parse(Name: string): number {
        const Env: string | undefined = process.env[Name]?.trim().toLowerCase();

        if(!Env) {
            if(!this.DefaultValue)
                throw new TypeError(`Variable ${Name} doesn't exists.`);
            return this.DefaultValue;
        }

        const Parsed: number = Number(Env);

        if(Number.isNaN(Parsed))
            throw new TypeError(`Variable ${Name} isn't a number.`);
        return Parsed;
    }

    public Default(Value: number): this {
        if(Value != undefined && typeof Value !== "number")
            throw new TypeError("Mismatched type between default value and the provided type.");
        this.DefaultValue = Value;
        return this;
    }
}
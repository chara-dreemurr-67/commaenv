import EnvDataType from "../EnvDataType.js";

enum NumberType {
    Positive,
    Negative
}

export default class ENumber extends EnvDataType<number> {
    private NumberType?: NumberType;
    private AcceptZero?: boolean;

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

        if(this.NumberType) {
        }

        return Parsed;
    }

    public Default(Value: number): this {
        if(Value != undefined && typeof Value !== "number")
            throw new TypeError("Mismatched type between default value and the provided type.");
        this.DefaultValue = Value;
        return this;
    }

    /**
     * Make the parser only accepts positive number. Set AcceptZero to true to accept 0 as a valid value.
     */
    public Positive(AcceptZero?: boolean) {
        this.NumberType = NumberType.Positive;
        this.AcceptZero = AcceptZero;
    }

    /**
     * Make the parser only accepts Negative number. Set AcceptZero to true to accept 0 as a valid value.
     */
    public Negative(AcceptZero?: boolean) {
        this.NumberType = NumberType.Negative;
        this.AcceptZero = AcceptZero;
    }
}
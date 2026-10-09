import EnvDataType from "../EnvDataType.js";

enum NumberType {
    Positive,
    Negative
}

export default class ENumber extends EnvDataType<number> {
    private NumberType?: NumberType;
    private AcceptZero?: boolean;
    private IsInteger?: boolean;

    public Parse(Name: string): number {
        const Env: string | undefined = process.env[Name]?.trim().toLowerCase();

        if(!Env) {
            if(this.DefaultValue == undefined)
                throw new TypeError(`Variable ${Name} doesn't exists.`);
            return this.DefaultValue;
        }

        const Parsed: number = Number(Env);

        if(Number.isNaN(Parsed))
            throw new TypeError(`Variable ${Name} isn't a number.`);

        if(this.IsInteger && !Number.isInteger(Parsed))
            throw new TypeError(`Variable ${Name} must be an integer.`);

        if(
            this.NumberType === NumberType.Positive
            && (this.AcceptZero && Parsed < 0 || !this.AcceptZero && Parsed <= 0)
        ) throw new TypeError(`Variable ${Name} isn't a positive number.`);

        if(
            this.NumberType === NumberType.Negative
            && (this.AcceptZero && Parsed > 0 || !this.AcceptZero && Parsed >= 0)
        ) throw new TypeError(`Variable ${Name} isn't a negative number.`);

        return Parsed;
    }

    public Default(Value: number): this {
        if(typeof Value !== "number" || Number.isNaN(Value))
            throw new TypeError("Mismatched type between default value and the provided type.");

        if(this.IsInteger && !Number.isInteger(Value))
            throw new TypeError("Value must be an integer.");

        if(
            this.NumberType === NumberType.Positive
            && (this.AcceptZero && Value < 0 || !this.AcceptZero && Value <= 0)
        ) throw new TypeError(`Value isn't a positive number.`);

        if(
            this.NumberType === NumberType.Negative
            && (this.AcceptZero && Value > 0 || !this.AcceptZero && Value >= 0)
        ) throw new TypeError("Value isn't a negative number.");

        this.DefaultValue = Value;
        return this;
    }

    /**
     * Only accepts positive number.
     * Set AcceptZero to true to accept 0 as a valid value.
     * Will override .Negative() if called after.
     * Runs after the integer check.
     */
    public Positive(AcceptZero?: boolean): this {
        this.NumberType = NumberType.Positive;
        this.AcceptZero = AcceptZero;
        return this;
    }

    /**
     * Only accepts negative number.
     * Set AcceptZero to true to accept 0 as a valid value.
     * Will override .Positive() if called after.
     * Runs after the integer check.
     */
    public Negative(AcceptZero?: boolean): this {
        this.NumberType = NumberType.Negative;
        this.AcceptZero = AcceptZero;
        return this;
    }

    /**
     * Only accepts integer. Runs before the Negative/Positive checks.
     */
    public Integer(): this {
        this.IsInteger = true;
        return this;
    }
}
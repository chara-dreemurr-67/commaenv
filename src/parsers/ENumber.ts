import EnvDataType from "../types/EnvDataType.js";

enum NumberType {
    Positive,
    Negative
}

export default class ENumber extends EnvDataType<number> {
    private NumberType?: NumberType;
    private AcceptZero?: boolean;
    private IsInteger?: boolean;
    private MinValue?: number;
    private MaxValue?: number;

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

        if(this.MaxValue != undefined && this.MaxValue < Parsed)
            throw new TypeError(`Variable ${Name} must be less than ${this.MaxValue}.`);

        if(this.MinValue != undefined && this.MinValue > Parsed)
            throw new TypeError(`Variable ${Name} must be greater than ${this.MinValue}.`);

        return Parsed;
    }

    /**
     * Test if the given value matched the parsing requirement, throw if not, do nothing otherwise.
     */
    public TestParse(Value: number): void {
        if(typeof Value !== "number" || Number.isNaN(Value))
            throw new TypeError("Value isn't a number.");

        if(this.IsInteger && !Number.isInteger(Value))
            throw new TypeError("Value must be an integer.");

        if(
            this.NumberType === NumberType.Positive
            && (this.AcceptZero && Value < 0 || !this.AcceptZero && Value <= 0)
        ) throw new TypeError("Value isn't a positive number.");

        if(
            this.NumberType === NumberType.Negative
            && (this.AcceptZero && Value > 0 || !this.AcceptZero && Value >= 0)
        ) throw new TypeError("Value isn't a negative number.");

        if(this.MaxValue != undefined && this.MaxValue < Value)
            throw new TypeError(`Value must be less than ${this.MaxValue}.`);

        if(this.MinValue != undefined && this.MinValue > Value) {
            throw new TypeError(`Value must be greater than ${this.MinValue}.`);
        }
    }

    public Default(Value: number): this {
        if(typeof Value !== "number" || Number.isNaN(Value))
            throw new TypeError("Mismatched type between default value and the provided type.");

        this.TestParse(Value);
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

    /**
     * Set the maximum value of the variable. This runs after the positive / negative checks.
     */
    public Max(Value: number): this {
        if(typeof Value !== "number" || Number.isNaN(Value))
            throw new TypeError("Value isn't a number.");

        if(this.MinValue != undefined && this.MinValue >= Value)
            throw new TypeError("Maximum value must be greater than the minimum value.");

        this.TestParse(Value);
        this.MaxValue = Value;
        return this;
    }

    /**
     * Set the minimum value of the variable. This runs after the positive / negative checks.
     */
    public Min(Value: number): this {
        if(typeof Value !== "number" || Number.isNaN(Value))
            throw new TypeError("Value isn't a number.");

        if(this.MaxValue != undefined && this.MaxValue <= Value)
            throw new TypeError("Minimum value must be less than the maximum value.");

        this.TestParse(Value);
        this.MinValue = Value;
        return this;
    }
}
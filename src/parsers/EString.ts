import EnvDataType from "../types/EnvDataType.js";

export default class EString extends EnvDataType<string> {
    private ValidatorFunc?: (Env: string) => boolean;
    private ValidationFailureMessage?: any;
    private MaxStringLength?: number;
    private MinStringLength?: number;

    public Parse(Name: string): string {
        const Env: string | undefined = process.env[Name];
        
        if(Env == undefined) {
            if(!this.DefaultValue)
                throw new TypeError(`Variable ${Name} doesn't exists.`);
            return this.DefaultValue;
        }

        if(this.ValidatorFunc && !this.ValidatorFunc(Env))
            throw new TypeError(this.ValidationFailureMessage ?? `Variable ${Name} failed validator test.`);

        const Length: number = Env.length;
        if(this.MaxStringLength != undefined && this.MaxStringLength < Length)
            throw new TypeError(`Variable ${Name} must be shorter than ${this.MaxStringLength} character${this.MaxStringLength > 1 ? "s" : ""}.`);

        if(this.MinStringLength != undefined && this.MinStringLength > Length)
            throw new TypeError(`Variable ${Name} must be longer than ${this.MinStringLength} character${this.MinStringLength > 1 ? "s" : ""}.`);

        return Env;
    }

    /**
     * Test if the given value matched the parsing requirement, throw if not, do nothing otherwise.
     */
    public TestParse(Value: string): void {
        if(typeof Value !== "string")
            throw new TypeError("Value must be a string.");

        if(this.ValidatorFunc && !this.ValidatorFunc(Value))
            throw new TypeError(this.ValidationFailureMessage ?? `Value failed validator test.`);

        const Length: number = Value.length;
        if(this.MaxStringLength != undefined && this.MaxStringLength < Length) 
            throw new TypeError(`Value must be shorter than ${this.MaxStringLength} character${this.MaxStringLength > 1 ? "s" : ""}.`);

        if(this.MinStringLength != undefined && this.MinStringLength > Length) {
            throw new TypeError(`Value must be longer than ${this.MinStringLength} character${this.MinStringLength > 1 ? "s" : ""}.`);
        }
    }

    /**
     * Set a custom message for when string validation return false.
     */
    public OnValidationFailure(Message: any): this {
        this.ValidationFailureMessage = Message;
        return this;
    }

    public Default(Value: string): this {
        this.TestParse(Value);
        this.DefaultValue = Value;
        return this;
    }

    /**
     * Accepts a validation function that runs before returning.
     */
    public Validator(Validator: (Env: string) => boolean): this {
        if(typeof Validator !== "function")
            throw new TypeError("Validator must be a function.");

        this.ValidatorFunc = Validator;
        return this;
    }

    /**
     * Set the maximum length of the variable.
     */
    public MaxLength(Length: number): this {
        if(typeof Length !== "number") 
            throw new TypeError(`Value ${Length} isn't a number.`);

        if(!Number.isInteger(Length))
            throw new RangeError("Value must be an integer.");

        if(Length < 0) 
            throw new RangeError("String length cannot go into the negative.");

        if(this.MinStringLength != undefined && Length <= this.MinStringLength) 
            throw new RangeError("Maximum string length must be greater than minimum string length.");

        this.MaxStringLength = Length;
        return this;
    }

    /**
     * Set the minimum length of the variable.
     */
    public MinLength(Length: number): this {
        if(typeof Length !== "number") 
            throw new TypeError(`Value ${Length} isn't a number.`);

        if(!Number.isInteger(Length))
            throw new RangeError("Invalid string length.");

        if(Length < 0) 
            throw new RangeError("String length cannot go into the negative.");

        if(this.MaxStringLength != undefined && Length >= this.MaxStringLength) 
            throw new RangeError("Minimum string length must be less than maximum string length.");

        this.MinStringLength = Length;
        return this;
    }
}
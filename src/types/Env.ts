import EnvDataType from "./EnvDataType.js";
import EArray from "../parsers/EArray.js";
import ELiteral from "../parsers/ELiteral.js";
import ENumber from "../parsers/ENumber.js";
import EString from "../parsers/EString.js";
import EBoolean from "../parsers/EBoolean.js"

type ValueType = number | unknown[] | string | boolean;

export class EnvLoader {
    public readonly Variables: Map<string, ValueType> = new Map();

    /**
     * Get variable of name {@link Name}.
     * 
     * @throws If variable doesn't exist or wasn't registered.
     */
    public GetVariable<T extends ValueType>(Name: string): T {
        if(!this.Variables.has(Name))
            throw new TypeError(`Variable ${Name} doesn't exists or wasn't registered.`);
        return this.Variables.get(Name) as T;
    }
    
    /**
     * Add variable of name {@link Name}, do nothing if variable already registered.
     * 
     * Optionally takes a {@link Type} object to specify parser type, if none were provided, default to string instead.
     * 
     * This method does not reject empty strings if the reported type is string, otherwise treat empty string as missing variable and defaults to {@link Default} if a value was provided.
     * 
     * @throws If reported type doesn't match with the variable's actual type (won't throw for this if variable is string), if registered variable doesn't exist in process.env and there is no default value provided, or if the type of {@link Default} doesn't match with the reported type of the variable.
     */
    public RegisterVariable<T extends ValueType = string>(Name: string, Type?: EnvDataType<T>): this {
        if(this.Variables.has(Name))
            return this;

        if(!Type)
            Type = this.string() as unknown as EnvDataType<T>;

        this.Variables.set(Name, Type.Parse(Name))
        return this;
    }
    
    /**
     * Create an array parser for RegisterVariable. Does not support nested array or boolean array.
     */
    public array<T extends "number" | "string">(Type: T): EArray<T> {
        return new EArray(Type);
    }
    /**
     * Create a number parser for RegisterVariable.
     */
    public number(): ENumber {
        return new ENumber();
    }
    /**
     * Create a string parser for RegisterVariable. This is the default of RegisterVariable.
     */
    public string(): EString {
        return new EString();
    }
    /**
     * Create a boolean parser for RegisterVariable.
     */
    public boolean(): EBoolean {
        return new EBoolean();
    }
    /**
     * Create a literal union parser for RegisterVariable. Only accepts number union or string union. 
     */
    public literal<T extends number | string>(Values: T): ELiteral<T>;
    public literal<T extends number | string>(...Values: T[]): ELiteral<T>;
    public literal<T extends number | string>(...Values: T[]): ELiteral<T> {
        return new ELiteral(...Values);
    }
}

const Env: EnvLoader = new EnvLoader();

export default Env;
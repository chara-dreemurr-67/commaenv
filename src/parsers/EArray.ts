import EnvDataType from "../types/EnvDataType.js";

type TypeMap = {
    number: number;
    string: string;
};

export default class EArray<T extends keyof TypeMap> extends EnvDataType<TypeMap[T][]> {
    private ArrayParser: (Value: string) => TypeMap[T][] = JSON.parse;
    private ArrayTransformer?: (Value: TypeMap[T], Index: number, Array: TypeMap[T][]) => TypeMap[T];
    
    private readonly Type: T;

    constructor(Type: T) {
        super();

        if(!["number", "string"].includes(Type))
            throw new TypeError(`Unknown array type "${Type}".`);

        this.Type = Type;
    }

    public Parse(Name: string): TypeMap[T][] {
        const Env: string | undefined = process.env[Name]?.trim();

        if(!Env) {
            if(!this.DefaultValue)
                throw new TypeError(`Variable ${Name} doesn't exists.`);
            return this.DefaultValue;
        }

        try {
            const Parsed: TypeMap[T][] = this.ArrayParser(Env);

            if(!Array.isArray(Parsed) || !Parsed.every(E => typeof E === this.Type))
                throw new TypeError(`Variable ${Name} isn't an array of type ${this.Type}.`);
            
            return this.ArrayTransformer ? Parsed.map(this.ArrayTransformer) : Parsed;
        }
        catch {
            throw new TypeError(`Variable ${Name} isn't an array of type ${this.Type}.`);
        }
    }

    public Default(Value: TypeMap[T][]): this {
        if(!Array.isArray(Value) || !Value.every(E => typeof E === this.Type))
            throw new TypeError("Mismatched type between default value and the provided type.");

        this.DefaultValue = Value;
        return this;
    }

    public Parser(Parser: (Value: string) => TypeMap[T][]): this {
        if(typeof Parser !== "function")
            throw new TypeError("Parser must be a function.");
        this.ArrayParser = Parser;
        return this;
    }

    /**
     * Provide a transformer function to transform the parsed array before returning it. The transformer function will be called for each element in the array, and it will receive the element value, its index, and the entire array as arguments. The return value of the transformer function will replace the original element in the array.
     */
    public Transformer(Transformer: (Value: TypeMap[T], Index: number, Array: TypeMap[T][]) => TypeMap[T]): this {
        if(typeof Transformer !== "function")
            throw new TypeError("Transformer must be a function.");
        this.ArrayTransformer = Transformer;
        return this;
    }
}
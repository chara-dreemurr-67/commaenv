import EnvDataType from "../types/EnvDataType.js";

type TypeMap = {
    number: number;
    string: string;
};

export default class EArray<T extends "number" | "string"> extends EnvDataType<TypeMap[T][]> {
    private P: (Value: string) => TypeMap[T][] = JSON.parse;
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
            const Parsed: unknown[] = this.P(Env);

            if(!Array.isArray(Parsed) || !Parsed.every(E => typeof E === this.Type))
                throw new TypeError(`Variable ${Name} isn't an array of type ${this.Type}.`);
            
            return Parsed as TypeMap[T][];
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
        this.P = Parser;
        return this;
    }
}
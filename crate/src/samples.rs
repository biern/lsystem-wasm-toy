use lsystem::*;


pub fn inline_formula(label: &str, tokens: &str) -> Formula {
    Formula {
        symbol: String::from(label),
        tokens: String::from(tokens).split("").map(|s| s.into()).collect(),
    }
}


pub fn get_algae_formula() -> LSystem {
    vec![
        inline_formula("A", "AB"),
        inline_formula("B", "A"),
    ]
}


pub fn koch_curve() -> LSystem {
    vec![
        inline_formula("F", "F+F-F-F+F"),
    ]
}


pub fn arrowhead() -> LSystem {
    vec![
        inline_formula("A", "B-A-B"),
        inline_formula("B", "A+B+A"),
    ]
}


pub fn plant() -> LSystem {
    vec![
        inline_formula("X", "F+[[X]-X]-F[-FX]+X"),
        inline_formula("F", "FF"),
    ]
}

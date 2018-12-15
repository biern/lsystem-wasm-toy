use lsystem::*;


pub fn get_algae_formula() -> LSystem {
    vec![
        Formula { symbol: 'A', tokens: vec!['A', 'B'] },
        Formula { symbol: 'B', tokens: vec!['A'] },
    ]
}


pub fn koch_curve() -> LSystem {
    vec![
        Formula {
            symbol: 'F',
            tokens: vec!['F', '+', 'F', '-', 'F', '-', 'F', '+', 'F'],
        },
    ]
}


pub fn arrowhead() -> LSystem {
    vec![
        Formula {
            symbol: 'A',
            tokens: vec!['B', '-', 'A', '-', 'B'],
        },
        Formula {
            symbol: 'B',
            tokens: vec!['A', '+', 'B', '+', 'A'],
        },
    ]
}


pub fn plant() -> LSystem {
    vec![
        Formula {
            symbol: 'X',
            tokens: vec![
                'F', '+',
                '[', '[', 'X', ']', '-', 'X', ']',
                '-', 'F',
                '[', '-', 'F', 'X', ']',
                '+', 'X',
            ],
        },
        Formula {
            symbol: 'F',
            tokens: vec!['F', 'F'],
        },
    ]
}

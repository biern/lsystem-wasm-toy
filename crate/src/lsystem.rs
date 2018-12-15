pub type CompiledLSystem = Vec<Symbol>;

pub type LSystem = Vec<Formula>;

pub type Symbol = char;
pub type Tokens = Vec<Symbol>;


pub struct Formula {
    pub symbol: Symbol,
    pub tokens: Tokens,
}


pub fn compile(system: &LSystem, iterations: u32) -> Result<CompiledLSystem, String> {
    let root_formula = system.first()
        .ok_or(String::from("LSystem is empty"))?;
    let axiom = root_formula.symbol;

    let range = 0..iterations;

    Result::Ok(range.fold(vec![axiom], |acc, _i| compile_iter(acc, system)))
}


fn compile_iter(tokens: Tokens, formulas: &LSystem) -> Tokens {
    tokens
        .into_iter()
        .flat_map(|token| {
            let formula = formulas.iter().find(|x| x.symbol == token);
            match formula {
                Option::Some(f) => f.tokens.clone(),
                Option::None => vec![token],
            }
        })
        .collect()
}


mod test {
    use lsystem::*;
    use samples::*;

    #[test]
    fn compiles_algae_n_0() {
        let algae = get_algae_formula();
        assert_eq!(compile(&algae, 0).unwrap(), vec!['A']);
    }

    #[test]
    fn compiles_algae_n_1() {
        let algae = get_algae_formula();
        assert_eq!(compile(&algae, 1).unwrap(), vec!['A', 'B']);
    }

    #[test]
    fn compiles_algae_n_2() {
        let algae = get_algae_formula();
        assert_eq!(compile(&algae, 2).unwrap(), vec!['A', 'B', 'A']);
    }

    #[test]
    fn compiles_algae_n_3() {
        let algae = get_algae_formula();
        assert_eq!(compile(&algae, 3).unwrap(), vec!['A', 'B', 'A', 'A', 'B']);
    }
}

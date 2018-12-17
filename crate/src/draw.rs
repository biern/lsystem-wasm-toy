use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;
use std::fmt;

use lsystem::{CompiledLSystem,Symbol};


pub struct Operation {
    pub symbol: Symbol,
    pub execute: Box<Fn(&CanvasRenderingContext2d) -> Result<(), JsValue>>,
}


impl fmt::Debug for Operation {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Operation {:?}", self.symbol)
    }
}


pub type Operations = Vec<Box<Operation>>;


#[wasm_bindgen]
pub fn op_forward_pointer(symbol: Symbol, amount: f64) -> i32 {
    let op = Box::new(op_forward(symbol, amount));
    Box::into_raw(op) as i32
}


#[wasm_bindgen]
pub fn op_rotate_pointer(symbol: Symbol, amount: f64) -> i32 {
    let op = Box::new(op_rotate(symbol, amount));
    Box::into_raw(op) as i32
}


pub fn op_forward(symbol: Symbol, amount: f64) -> Operation {
    Operation {
        symbol,
        execute: Box::new(move |ctx| {
            ctx.begin_path();
            ctx.move_to(0.0, 0.0);
            ctx.line_to(0.0, amount);
            ctx.translate(0.0, amount)?;
            ctx.stroke();
            Result::Ok(())
        })
    }
}


pub fn op_rotate(symbol: Symbol, degrees: f64) -> Operation {
    Operation {
        symbol,
        execute: Box::new(move |ctx| {
            ctx.rotate(degrees * std::f64::consts::PI / 180.0)?;
            Result::Ok(())
        }),
    }
}


pub fn op_push(symbol: Symbol) -> Operation {
    Operation {
        symbol,
        execute: Box::new(move |ctx| {
            ctx.save();
            Result::Ok(())
        }),
    }
}


pub fn op_pop(symbol: Symbol) -> Operation {
    Operation {
        symbol,
        execute: Box::new(move |ctx| {
            ctx.restore();
            Result::Ok(())
        }),
    }
}


pub fn op_noop(symbol: Symbol) -> Operation {
    Operation {
        symbol, execute: Box::new(|_ctx| { Result::Ok(())})
    }
}


pub fn draw(
    ctx: &CanvasRenderingContext2d,
    compiled: &CompiledLSystem,
    operations: &Operations,
) -> Result<(), JsValue> {

    for token in compiled {
        let found = operations.iter().find(|o| o.symbol == *token);
        match found {
            Option::Some(op) => (op.execute)(ctx)?,
            Option::None => (),
        }
    }

    Result::Ok(())
}

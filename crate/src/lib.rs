#![feature(use_extern_macros)]

#[macro_use]
extern crate cfg_if;

extern crate wasm_bindgen;
extern crate web_sys;

#[macro_use]
extern crate serde_derive;

extern crate serde;
extern crate serde_json;

use wasm_bindgen::prelude::*;

mod lsystem;
pub mod samples;
pub mod draw;


cfg_if! {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function to get better error messages if we ever panic.
    if #[cfg(feature = "console_error_panic_hook")] {
        extern crate console_error_panic_hook;
        use console_error_panic_hook::set_once as set_panic_hook;
    }
}

cfg_if! {
    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
    // allocator.
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}


#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: String);
}


#[wasm_bindgen]
pub fn draw_operations(
    context: web_sys::CanvasRenderingContext2d,
    operation_pointers: Vec<i32>,
    compiled_string: String,
) -> Result<(), JsValue>  {
    let operations: Vec<Box<draw::Operation>> = operation_pointers.iter().map(|p| {
        unsafe { Box::from_raw(*p as *mut draw::Operation) }
    }).collect();

    let compiled: lsystem::CompiledLSystem =
        compiled_string.split("")
        .map(|c| c.into())
        .filter(|s: &String| !s.is_empty())
        .collect();

    log(format!("Compiled {:?}", compiled));
    log(format!("Operations {:?}", operations));

    draw::draw(&context, &compiled, &operations)?;

    Result::Ok(())
}


#[wasm_bindgen]
pub fn compile(data: String, iterations: u32) -> Result<String, JsValue> {
    let system: lsystem::LSystem = serde_json::from_str(&data)
        .map_err(|e| e.to_string())?;

    let compiled = lsystem::compile(&system, iterations)?;

    Result::Ok(compiled.join(""))
}

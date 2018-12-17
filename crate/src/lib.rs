#![feature(use_extern_macros)]

#[macro_use]
extern crate cfg_if;

extern crate wasm_bindgen;
extern crate web_sys;

#[macro_use]
extern crate serde_derive;

extern crate serde;
extern crate serde_json;

use wasm_bindgen::JsCast;
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


// Called by our JS entry point to run the example
#[wasm_bindgen]
pub fn run() -> Result<(), JsValue> {
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    let val = document.create_element("p")?;

    let body = document.body().expect("document should have a body");

    val.set_inner_html("Hello from Rust!");

    // Right now the class inheritance hierarchy of the DOM isn't super
    // ergonomic, so we manually cast `val: Element` to `&Node` to call the
    // `append_child` method.
    AsRef::<web_sys::Node>::as_ref(&body).append_child(val.as_ref())?;

    // let val = document.createElement("p");
    // val.set_inner_html("Hello from Rust, WebAssembly, and Parcel foobar2!");
    // document.body().append_child(val);
    Ok(())
}


#[wasm_bindgen]
pub fn draw(context: web_sys::CanvasRenderingContext2d, i: u32) {
    context.clear_rect(0.0, 0.0, 150.0, 150.0);

    context.save();

    context.translate(75.0, 75.0).unwrap();
    context.rotate(i as f64 * std::f64::consts::PI / 180.0).unwrap();

    context.begin_path();

    // Draw the outer circle.
    context
        .arc(0.0, 0.0, 50.0, 0.0, std::f64::consts::PI * 2.0)
        .unwrap();

    // Draw the mouth.
    context.move_to(35.0, 0.0);
    context.arc(0.0, 0.0, 35.0, 0.0, std::f64::consts::PI).unwrap();

    // Draw the left eye.
    context.move_to(-10.0, -10.0);
    context
        .arc(-15.0, -10.0, 5.0, 0.0, std::f64::consts::PI * 2.0)
        .unwrap();

    // Draw the right eye.
    context.move_to(20.0, -10.0);
    context
        .arc(15.0, -10.0, 5.0, 0.0, std::f64::consts::PI * 2.0)
        .unwrap();

    context.stroke();

    context.restore();
}


#[wasm_bindgen]
pub fn draw_stuff(
    context: web_sys::CanvasRenderingContext2d,
    i: u32,
) -> Result<(), JsValue> {
    let canvas = context.canvas().unwrap();
    let width = canvas.width();
    let height = canvas.height();

    // let system = samples::get_algae_formula();
    let system = samples::koch_curve();
    let compiled = lsystem::compile(&system, i)?;

    let operations = vec![
        Box::new(draw::op_forward(String::from("F"), 5.0)),
        Box::new(draw::op_rotate(String::from("-"), 90.0)),
        Box::new(draw::op_rotate(String::from("+"), -90.0)),
    ];

    draw::draw(&context, &compiled, &operations)?;
    Result::Ok(())
}


// #[wasm_bindgen]
// pub fn draw_arrowhead(
//     context: web_sys::CanvasRenderingContext2d,
//     i: u32,
// ) -> Result<(), JsValue> {
//     let canvas = context.canvas().unwrap();
//     let width = canvas.width();
//     let height = canvas.height();

//     context.translate((width / 2).into(), 0.0)?;
//     context.rotate(30.0 * std::f64::consts::PI / 180.0)?;

//     // let system = samples::get_algae_formula();
//     let system = samples::arrowhead();
//     let compiled = lsystem::compile(&system, i)?;

//     let operations = vec![
//         Box::new(draw::op_forward('A', 3.0)),
//         Box::new(draw::op_forward('B', 3.0)),
//         Box::new(draw::op_rotate('+', 60.0)),
//         Box::new(draw::op_rotate('-', -60.0)),
//     ];

//     draw::draw(&context, &compiled, &operations)?;

//     Result::Ok(())
// }

// #[wasm_bindgen]
// pub fn draw_plant(
//     context: web_sys::CanvasRenderingContext2d,
//     i: u32,
// ) -> Result<(), JsValue> {
//     let canvas = context.canvas().unwrap();
//     let width = canvas.width();
//     let height = canvas.height();

//     context.translate((width / 10).into(), height.into())?;
//     context.rotate(200.0 * std::f64::consts::PI / 180.0)?;

//     let system = samples::plant();
//     let compiled = lsystem::compile(&system, i)?;

//     // log(format!("Compiled {:?}", compiled));

//     let operations = vec![
//         Box::new(draw::op_forward('F', 5.0)),
//         Box::new(draw::op_noop('X')),
//         Box::new(draw::op_rotate('+', -25.0)),
//         Box::new(draw::op_rotate('-', 25.0)),
//         Box::new(draw::op_push('[')),
//         Box::new(draw::op_pop(']')),
//     ];

//     draw::draw(&context, &compiled, &operations)?;

//     Result::Ok(())
// }


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

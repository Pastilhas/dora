module main

import veb
import x.templating.dtm
import os

pub struct Context {
	veb.Context
pub mut:
	path string
}

pub struct App {
	veb.StaticHandler
	veb.Middleware[Context]
pub mut:
	dtmi &dtm.DynamicTemplateManager
}

fn main() {
	cache := os.join_path(os.temp_dir(), 'veb_cache')
	mut app := &App{
		dtmi: dtm.initialize(def_cache_path: cache)
	}
	app.handle_static('static', true)!

	defer {
		app.dtmi.stop_cache_handler()
	}

	app.use(veb.encode_gzip[Context]())
	veb.run[App, Context](mut app, 8080)
}

@['/']
pub fn (mut app App) index(mut ctx Context) veb.Result {
	mut tmpl_var := map[string]dtm.DtmMultiTypeMap{}
	tmpl_var['title'] = 'The true title'
	html_content := app.dtmi.expand('index.html', placeholders: &tmpl_var)
	return ctx.html(html_content)
}

pub fn (mut ctx Context) not_found() veb.Result {
	ctx.res.set_status(.not_found)
	return ctx.html('<h1>Page not found!</h1>')
}

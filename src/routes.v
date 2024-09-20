module main

import os
import veb

@['/getdir'; get]
pub fn (mut app App) getdir(mut ctx Context, path string) veb.Result {
	dir := os.ls('/home/joao') or { return ctx.not_found() }
	return ctx.json(dir)
}

@['/getdir/:path...'; get]
pub fn (mut app App) getdir_path(mut ctx Context, path string) veb.Result {
	dir := os.ls('/home/joao/${path}') or { return ctx.not_found() }
	return ctx.json(dir)
}

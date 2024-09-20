module main

import os
import veb

fn stat_entry(path string) map[string]string {
	mut obj := map[string]string{}

	if stat := os.lstat(path) {
		obj['name'] = os.base(path)
		obj['type'] = stat.get_filetype().str()
		obj['size'] = (stat.size / 1024).str()
		obj['atime'] = stat.atime.str()
		obj['mtime'] = stat.mtime.str()
	}

	return obj
}

@['/getdir'; get]
pub fn (mut app App) getdir(mut ctx Context) veb.Result {
	p := os.home_dir()

	if os.is_dir(p) {
		dir := os.ls(p) or { return ctx.not_found() }
		abs := dir.map(os.join_path(p, it))
		res := abs.map(stat_entry)
		return ctx.json(res)
	}

	return ctx.not_found()
}

@['/getdir/:path...'; get]
pub fn (mut app App) getdir_path(mut ctx Context, path string) veb.Result {
	p := os.join_path(os.home_dir(), path)

	if os.is_dir(p) {
		dir := os.ls(p) or { return ctx.not_found() }
		abs := dir.map(os.join_path(p, it))
		res := abs.map(stat_entry)
		return ctx.json(res)
	}

	return ctx.not_found()
}

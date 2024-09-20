module main

import os
import veb

struct Dir {
	path    string
	entries []map[string]string
}

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

fn getdir(mut ctx Context, path string) veb.Result {
	if os.is_dir(path) {
		dir := os.ls(path) or { return ctx.not_found() }
		abs := dir.map(os.join_path(path, it))
		ets := abs.map(stat_entry)

		res := Dir{
			path:    path
			entries: ets
		}

		return ctx.json(res)
	}

	return ctx.not_found()
}

@['/getdir'; get]
pub fn (mut app App) getdir_home(mut ctx Context) veb.Result {
	return getdir(mut ctx, '/')
}

@['/getdir/:path...'; get]
pub fn (mut app App) getdir_path(mut ctx Context, path string) veb.Result {
	return getdir(mut ctx, '/${path}')
}

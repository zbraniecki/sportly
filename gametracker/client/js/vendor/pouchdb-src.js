﻿// pouchdb.nightly - 2013-08-19T16:33:39
(function () {
    function pathToTree(e) {
        for (var t, n = e.shift(), o = [n.id, n.opts, []], r = o; e.length;) n = e.shift(), t = [n.id, n.opts, []],
            r[2].push(t), r = t;
        return o
    }

    function mergeTree(e, t) {
        for (var n = [{
            tree1: e,
            tree2: t
        }], o = !1; n.length > 0;) {
            var r = n.pop(),
                i = r.tree1,
                a = r.tree2;
            (i[1].status || a[1].status) && (i[1].status = "available" === i[1].status || "available" === a[1].status ?
                    "available" : "missing");
            for (var u = 0; a[2].length > u; u++)
                if (i[2][0]) {
                    for (var s = !1, c = 0; i[2].length > c; c++) i[2][c][0] === a[2][u][0] && (n.push({
                        tree1: i[2][c],
                        tree2: a[2][u]
                    }), s = !0);
                    s || (o = "new_branch", i[2].push(a[2][u]), i[2].sort())
                } else o = "new_leaf", i[2][0] = a[2][u]
        }
        return {
            conflicts: o,
            tree: e
        }
    }

    function doMerge(e, t, n) {
        var o, r = [],
            i = !1,
            a = !1;
        return e.length ? (e.forEach(function (e) {
            if (e.pos === t.pos && e.ids[0] === t.ids[0]) o = mergeTree(e.ids, t.ids), r.push({
                pos: e.pos,
                ids: o.tree
            }), i = i || o.conflicts, a = !0;
            else if (n !== !0) {
                var u = e.pos < t.pos ? e : t,
                    s = e.pos < t.pos ? t : e,
                    c = s.pos - u.pos,
                    l = [],
                    d = [];
                for (d.push({
                    ids: u.ids,
                    diff: c,
                    parent: null,
                    parentIdx: null
                }) ; d.length > 0;) {
                    var f = d.pop();
                    0 !== f.diff ? f.ids && f.ids[2].forEach(function (e, t) {
                        d.push({
                            ids: e,
                            diff: f.diff - 1,
                            parent: f.ids,
                            parentIdx: t
                        })
                    }) : f.ids[0] === s.ids[0] && l.push(f)
                }
                var h = l[0];
                h ? (o = mergeTree(h.ids, s.ids), h.parent[2][h.parentIdx] = o.tree, r.push({
                    pos: u.pos,
                    ids: u.ids
                }), i = i || o.conflicts, a = !0) : r.push(e)
            } else r.push(e)
        }), a || r.push(t), r.sort(function (e, t) {
            return e.pos - t.pos
        }), {
            tree: r,
            conflicts: i || "internal_node"
        }) : {
            tree: [t],
            conflicts: "new_leaf"
        }
    }

    function stem(e, t) {
        var n = PouchMerge.rootToLeaf(e).map(function (e) {
            var n = e.ids.slice(-t);
            return {
                pos: e.pos + (e.ids.length - n.length),
                ids: pathToTree(n)
            }
        });
        return n.reduce(function (e, t) {
            return doMerge(e, t, !0).tree
        }, [n.shift()])
    }

    function replicate(e, t, n, o) {
        function r(o, r, i) {
            if (n.onChange)
                for (var a = 0; i > a; a++) n.onChange.apply(this, [P]);
            m -= i, P.docs_written += i, writeCheckpoint(e, t, p, g, function () {
                f.notifyRequestComplete(), d()
            })
        }

        function i() {
            if (!h.length) return f.notifyRequestComplete();
            var e = h.length;
            t.bulkDocs({
                docs: h
            }, {
                new_edits: !1
            }, function (t, n) {
                r(t, n, e)
            }), h = []
        }

        function a(t, n) {
            e.get(t, {
                revs: !0,
                rev: n,
                attachments: !0
            }, function (e, t) {
                f.notifyRequestComplete(), h.push(t), f.enqueue(i)
            })
        }

        function u(e, t) {
            if (f.notifyRequestComplete(), e) return y && o.cancel(), PouchUtils.call(n.complete, e, null), void 0;
            if (0 === Object.keys(t).length) return m--, d(), void 0;
            var r = function (e) {
                f.enqueue(a, [i, e])
            };
            for (var i in t) t[i].missing.forEach(r)
        }

        function s(e) {
            t.revsDiff(e, u)
        }

        function c(e) {
            g = e.seq, v.push(e), P.docs_read++, m++;
            var t = {};
            t[e.id] = e.changes.map(function (e) {
                return e.rev
            }), f.enqueue(s, [t])
        }

        function l() {
            _ = !0, d()
        }

        function d() {
            _ && 0 === m && (P.end_time = new Date, PouchUtils.call(n.complete, null, P))
        }
        var f = new RequestManager,
            h = [],
            p = genReplicationId(e, t, n),
            v = [],
            _ = !1,
            m = 0,
            g = 0,
            y = n.continuous || !1,
            E = n.doc_ids,
            P = {
                ok: !0,
                start_time: new Date,
                docs_read: 0,
                docs_written: 0
            };
        fetchCheckpoint(e, t, p, function (t, r) {
            if (t) return PouchUtils.call(n.complete, t);
            if (g = r, !o.cancelled) {
                var i = {
                    continuous: y,
                    since: g,
                    style: "all_docs",
                    onChange: c,
                    complete: l,
                    doc_ids: E
                };
                n.filter && (i.filter = n.filter), n.query_params && (i.query_params = n.query_params);
                var a = e.changes(i);
                n.continuous && (o.cancel = a.cancel)
            }
        })
    }

    function toPouch(e, t) {
        return "string" == typeof e ? new Pouch(e, t) : (t(null, e), void 0)
    }

    function arrayFirst(e, t) {
        for (var n = 0; e.length > n; n++)
            if (t(e[n], n) === !0) return e[n];
        return !1
    }

    function yankError(e) {
        return function (t, n) {
            t || n[0].error ? call(e, t || n[0]) : call(e, null, n[0])
        }
    }

    function computeHeight(e) {
        var t = {}, n = [];
        return PouchMerge.traverseRevTree(e, function (e, o, r, i) {
            var a = o + "-" + r;
            return e && (t[a] = 0), void 0 !== i && n.push({
                from: i,
                to: a
            }), a
        }), n.reverse(), n.forEach(function (e) {
            t[e.from] = void 0 === t[e.from] ? 1 + t[e.to] : Math.min(t[e.from], 1 + t[e.to])
        }), t
    }

    function parseUri(e) {
        for (var t = parseUri.options, n = t.parser[t.strictMode ? "strict" : "loose"].exec(e), o = {}, r = 14; r--;)
            o[t.key[r]] = n[r] || "";
        return o[t.q.name] = {}, o[t.key[12]].replace(t.q.parser, function (e, n, r) {
            n && (o[t.q.name][n] = r)
        }), o
    }

    function encodeDocId(e) {
        return /^_design/.test(e) ? e : encodeURIComponent(e)
    }

    function getHost(e) {
        if (/http(s?):/.test(e)) {
            var t = parseUri(e);
            t.remote = !0, (t.user || t.password) && (t.auth = {
                username: t.user,
                password: t.password
            });
            var n = t.path.replace(/(^\/|\/$)/g, "").split("/");
            return t.db = n.pop(), t.path = n.join("/"), t
        }
        return {
            host: "",
            path: "/",
            db: e,
            auth: !1
        }
    }

    function genDBUrl(e, t) {
        if (e.remote) {
            var n = e.path ? "/" : "";
            return e.protocol + "://" + e.host + ":" + e.port + "/" + e.path + n + e.db + "/" + t
        }
        return "/" + e.db + "/" + t
    }

    function genUrl(e, t) {
        if (e.remote) {
            var n = e.path ? "/" : "";
            return e.protocol + "://" + e.host + ":" + e.port + "/" + e.path + n + t
        }
        return "/" + t
    }

    function quote(e) {
        return "'" + e + "'"
    }
    var uuid;
    (function () {
        var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz".split("");
        uuid = function (t, n) {
            var o, r = e,
                i = [];
            if (n = n || r.length, t)
                for (o = 0; t > o; o++) i[o] = r[0 | Math.random() * n];
            else {
                var a;
                for (i[8] = i[13] = i[18] = i[23] = "-", i[14] = "4", o = 0; 36 > o; o++) i[o] || (a = 0 | 16 *
                    Math.random(), i[o] = r[19 == o ? 8 | 3 & a : a])
            }
            return i.join("")
        }
    })(), "undefined" != typeof module && module.exports && (module.exports = uuid);
    var Crypto = {};
    (function () {
        Crypto.MD5 = function (e) {
            function t(e, t) {
                return e << t | e >>> 32 - t
            }

            function n(e, t) {
                var n, o, r, i, a;
                return r = 2147483648 & e, i = 2147483648 & t, n = 1073741824 & e, o = 1073741824 & t, a = (
                    1073741823 & e) + (1073741823 & t), n & o ? 2147483648 ^ a ^ r ^ i : n | o ? 1073741824 & a ?
                    3221225472 ^ a ^ r ^ i : 1073741824 ^ a ^ r ^ i : a ^ r ^ i
            }

            function o(e, t, n) {
                return e & t | ~e & n
            }

            function r(e, t, n) {
                return e & n | t & ~n
            }

            function i(e, t, n) {
                return e ^ t ^ n
            }

            function a(e, t, n) {
                return t ^ (e | ~n)
            }

            function u(e, r, i, a, u, s, c) {
                return e = n(e, n(n(o(r, i, a), u), c)), n(t(e, s), r)
            }

            function s(e, o, i, a, u, s, c) {
                return e = n(e, n(n(r(o, i, a), u), c)), n(t(e, s), o)
            }

            function c(e, o, r, a, u, s, c) {
                return e = n(e, n(n(i(o, r, a), u), c)), n(t(e, s), o)
            }

            function l(e, o, r, i, u, s, c) {
                return e = n(e, n(n(a(o, r, i), u), c)), n(t(e, s), o)
            }

            function d(e) {
                for (var t, n = e.length, o = n + 8, r = (o - o % 64) / 64, i = 16 * (r + 1), a = Array(i - 1),
                        u = 0, s = 0; n > s;) t = (s - s % 4) / 4, u = 8 * (s % 4), a[t] = a[t] | e.charCodeAt(
                    s) << u, s++;
                return t = (s - s % 4) / 4, u = 8 * (s % 4), a[t] = a[t] | 128 << u, a[i - 2] = n << 3, a[i - 1] =
                    n >>> 29, a
            }

            function f(e) {
                var t, n, o = "",
                    r = "";
                for (n = 0; 3 >= n; n++) t = 255 & e >>> 8 * n, r = "0" + t.toString(16), o += r.substr(r.length -
                    2, 2);
                return o
            }
            var h, p, v, _, m, g, y, E, P, S = [],
                O = 7,
                b = 12,
                T = 17,
                R = 22,
                q = 5,
                C = 9,
                D = 14,
                k = 20,
                U = 4,
                w = 11,
                A = 16,
                x = 23,
                I = 6,
                j = 10,
                N = 15,
                B = 21;
            for (S = d(e), g = 1732584193, y = 4023233417, E = 2562383102, P = 271733878, h = 0; S.length > h; h +=
                16) p = g, v = y, _ = E, m = P, g = u(g, y, E, P, S[h + 0], O, 3614090360), P = u(P, g, y, E, S[
                h + 1], b, 3905402710), E = u(E, P, g, y, S[h + 2], T, 606105819), y = u(y, E, P, g, S[h + 3],
                R, 3250441966), g = u(g, y, E, P, S[h + 4], O, 4118548399), P = u(P, g, y, E, S[h + 5], b,
                1200080426), E = u(E, P, g, y, S[h + 6], T, 2821735955), y = u(y, E, P, g, S[h + 7], R,
                4249261313), g = u(g, y, E, P, S[h + 8], O, 1770035416), P = u(P, g, y, E, S[h + 9], b,
                2336552879), E = u(E, P, g, y, S[h + 10], T, 4294925233), y = u(y, E, P, g, S[h + 11], R,
                2304563134), g = u(g, y, E, P, S[h + 12], O, 1804603682), P = u(P, g, y, E, S[h + 13], b,
                4254626195), E = u(E, P, g, y, S[h + 14], T, 2792965006), y = u(y, E, P, g, S[h + 15], R,
                1236535329), g = s(g, y, E, P, S[h + 1], q, 4129170786), P = s(P, g, y, E, S[h + 6], C,
                3225465664), E = s(E, P, g, y, S[h + 11], D, 643717713), y = s(y, E, P, g, S[h + 0], k,
                3921069994), g = s(g, y, E, P, S[h + 5], q, 3593408605), P = s(P, g, y, E, S[h + 10], C,
                38016083), E = s(E, P, g, y, S[h + 15], D, 3634488961), y = s(y, E, P, g, S[h + 4], k,
                3889429448), g = s(g, y, E, P, S[h + 9], q, 568446438), P = s(P, g, y, E, S[h + 14], C,
                3275163606), E = s(E, P, g, y, S[h + 3], D, 4107603335), y = s(y, E, P, g, S[h + 8], k,
                1163531501), g = s(g, y, E, P, S[h + 13], q, 2850285829), P = s(P, g, y, E, S[h + 2], C,
                4243563512), E = s(E, P, g, y, S[h + 7], D, 1735328473), y = s(y, E, P, g, S[h + 12], k,
                2368359562), g = c(g, y, E, P, S[h + 5], U, 4294588738), P = c(P, g, y, E, S[h + 8], w,
                2272392833), E = c(E, P, g, y, S[h + 11], A, 1839030562), y = c(y, E, P, g, S[h + 14], x,
                4259657740), g = c(g, y, E, P, S[h + 1], U, 2763975236), P = c(P, g, y, E, S[h + 4], w,
                1272893353), E = c(E, P, g, y, S[h + 7], A, 4139469664), y = c(y, E, P, g, S[h + 10], x,
                3200236656), g = c(g, y, E, P, S[h + 13], U, 681279174), P = c(P, g, y, E, S[h + 0], w,
                3936430074), E = c(E, P, g, y, S[h + 3], A, 3572445317), y = c(y, E, P, g, S[h + 6], x,
                76029189), g = c(g, y, E, P, S[h + 9], U, 3654602809), P = c(P, g, y, E, S[h + 12], w,
                3873151461), E = c(E, P, g, y, S[h + 15], A, 530742520), y = c(y, E, P, g, S[h + 2], x,
                3299628645), g = l(g, y, E, P, S[h + 0], I, 4096336452), P = l(P, g, y, E, S[h + 7], j,
                1126891415), E = l(E, P, g, y, S[h + 14], N, 2878612391), y = l(y, E, P, g, S[h + 5], B,
                4237533241), g = l(g, y, E, P, S[h + 12], I, 1700485571), P = l(P, g, y, E, S[h + 3], j,
                2399980690), E = l(E, P, g, y, S[h + 10], N, 4293915773), y = l(y, E, P, g, S[h + 1], B,
                2240044497), g = l(g, y, E, P, S[h + 8], I, 1873313359), P = l(P, g, y, E, S[h + 15], j,
                4264355552), E = l(E, P, g, y, S[h + 6], N, 2734768916), y = l(y, E, P, g, S[h + 13], B,
                1309151649), g = l(g, y, E, P, S[h + 4], I, 4149444226), P = l(P, g, y, E, S[h + 11], j,
                3174756917), E = l(E, P, g, y, S[h + 2], N, 718787259), y = l(y, E, P, g, S[h + 9], B,
                3951481745), g = n(g, p), y = n(y, v), E = n(E, _), P = n(P, m);
            var M = f(g) + f(y) + f(E) + f(P);
            return M.toLowerCase()
        }
    })(),
    function () {
        if (!Object.defineProperty || ! function () {
            try {
                return Object.defineProperty({}, "x", {}), !0
        } catch (e) {
                return !1
        }
        }()) {
            var e = Object.defineProperty;
            Object.defineProperty = function (t, n, o) {
                "use strict";
                if (e) try {
                    return e(t, n, o)
                } catch (r) { }
                if (t !== Object(t)) throw new TypeError("Object.defineProperty called on non-object");
                return Object.prototype.__defineGetter__ && "get" in o && Object.prototype.__defineGetter__.call(t,
                    n, o.get), Object.prototype.__defineSetter__ && "set" in o && Object.prototype.__defineSetter__
                    .call(t, n, o.set), "value" in o && (t[n] = o.value), t
            }
        }
    }(), Object.keys || (Object.keys = function (e) {
        if (e !== Object(e)) throw new TypeError("Object.keys called on non-object");
        var t, n = [];
        for (t in e) Object.prototype.hasOwnProperty.call(e, t) && n.push(t);
        return n
    }), Array.prototype.forEach || (Array.prototype.forEach = function (e) {
        "use strict";
        if (void 0 === this || null === this) throw new TypeError;
        var t = Object(this),
            n = t.length >>> 0;
        if ("function" != typeof e) throw new TypeError;
        var o, r = arguments[1];
        for (o = 0; n > o; o++) o in t && e.call(r, t[o], o, t)
    }), Array.prototype.map || (Array.prototype.map = function (e) {
        "use strict";
        if (void 0 === this || null === this) throw new TypeError;
        var t = Object(this),
            n = t.length >>> 0;
        if ("function" != typeof e) throw new TypeError;
        var o = [];
        o.length = n;
        var r, i = arguments[1];
        for (r = 0; n > r; r++) r in t && (o[r] = e.call(i, t[r], r, t));
        return o
    });
    for (var class2type = {}, types = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp",
            "Object", "Error"
    ], i = 0; types.length > i; i++) {
        var typename = types[i];
        class2type["[object " + typename + "]"] = typename.toLowerCase()
    }
    var core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty,
        type = function (e) {
            return null === e ? e + "" : "object" == typeof e || "function" == typeof e ? class2type[core_toString.call(
                e)] || "object" : typeof e
        }, isWindow = function (e) {
            return null !== e && e === e.window
        }, isPlainObject = function (e) {
            if (!e || "object" !== type(e) || e.nodeType || isWindow(e)) return !1;
            try {
                if (e.constructor && !core_hasOwn.call(e, "constructor") && !core_hasOwn.call(e.constructor.prototype,
                    "isPrototypeOf")) return !1
            } catch (t) {
                return !1
            }
            var n;
            for (n in e);
            return void 0 === n || core_hasOwn.call(e, n)
        }, isFunction = function (e) {
            return "function" === type(e)
        }, isArray = Array.isArray || function (e) {
            return "array" === type(e)
        }, extend = function () {
            var e, t, n, o, r, i, a = arguments[0] || {}, u = 1,
                s = arguments.length,
                c = !1;
            for ("boolean" == typeof a && (c = a, a = arguments[1] || {}, u = 2), "object" == typeof a ||
                isFunction(a) || (a = {}), s === u && (a = this, --u) ; s > u; u++)
                if (null != (e = arguments[u]))
                    for (t in e) n = a[t], o = e[t], a !== o && (c && o && (isPlainObject(o) || (r = isArray(o))) ?
                        (r ? (r = !1, i = n && isArray(n) ? n : []) : i = n && isPlainObject(n) ? n : {}, a[t] =
                            extend(c, i, o)) : void 0 !== o && (isArray(e) && isFunction(o) || (a[t] = o)));
            return a
        };
    "undefined" != typeof module && module.exports && (module.exports = extend);
    var request, extend;
    "undefined" != typeof module && module.exports && (request = require("request"), extend = require("./extend.js"));
    var ajax = function ajax(e, t) {
        function n(e, t, n) {
            if (n) {
                var o = new Date;
                o.setTime(o.getTime() + 1e3 * 60 * 60 * 24 * n);
                var r = "; expires=" + o.toGMTString()
            } else var r = "";
            document.cookie = e + "=" + t + r + "; path=/"
        }
        "function" == typeof e && (t = e, e = {});
        var o = function (e) {
            var t = Array.prototype.slice.call(arguments, 1);
            typeof e == typeof Function && e.apply(this, t)
        }, r = {
            method: "GET",
            headers: {},
            json: !0,
            processData: !0,
            timeout: 1e4
        };
        e = extend(!0, r, e);
        var i = function (t, n, r) {
            if (e.binary || e.json || !e.processData || "string" == typeof t) {
                if (!e.binary && e.json && "string" == typeof t) try {
                    t = JSON.parse(t)
                } catch (i) {
                    return o(r, i), void 0
                }
            } else t = JSON.stringify(t);
            o(r, null, t, n)
        }, a = function (e, t) {
            var n, r = {
                status: e.status
            };
            try {
                n = JSON.parse(e.responseText), r = extend(!0, {}, r, n)
            } catch (i) { }
            o(t, r)
        };
        if ("undefined" != typeof window && window.XMLHttpRequest) {
            var u, s = !1,
                c = new XMLHttpRequest;
            c.open(e.method, e.url), c.withCredentials = !0, e.json && (e.headers.Accept = "application/json", e.headers[
                    "Content-Type"] = e.headers["Content-Type"] || "application/json", e.body && e.processData &&
                "string" != typeof e.body && (e.body = JSON.stringify(e.body))), e.binary && (c.responseType =
                "arraybuffer");
            for (var l in e.headers)
                if ("Cookie" === l) {
                    var d = e.headers[l].split("=");
                    n(d[0], d[1], 10)
                } else c.setRequestHeader(l, e.headers[l]);
            "body" in e || (e.body = null);
            var f = function () {
                s = !0, c.abort(), o(a, c, t)
            };
            return c.onreadystatechange = function () {
                if (4 === c.readyState && !s)
                    if (clearTimeout(u), c.status >= 200 && 300 > c.status) {
                        var n;
                        n = e.binary ? new Blob([c.response || ""], {
                            type: c.getResponseHeader("Content-Type")
                        }) : c.responseText, o(i, n, c, t)
                    } else o(a, c, t)
            }, e.timeout > 0 && (u = setTimeout(f, e.timeout)), c.send(e.body), {
                abort: f
            }
        }
        return e.json && (e.binary || (e.headers.Accept = "application/json"), e.headers["Content-Type"] = e.headers[
            "Content-Type"] || "application/json"), e.binary && (e.encoding = null, e.json = !1), e.processData ||
            (e.json = !1), request(e, function (n, r, u) {
                if (n) return n.status = r ? r.statusCode : 400, o(a, n, t);
                var s = r.headers["content-type"],
                    c = u || "";
                if (e.binary || !e.json && e.processData || "object" == typeof c || !(/json/.test(s) || /^[\s]*\{/.test(
                    c) && /\}[\s]*$/.test(c)) || (c = JSON.parse(c)), r.statusCode >= 200 && 300 > r.statusCode) o(
                    i, c, r, t);
                else {
                    if (e.binary) var c = JSON.parse("" + c);
                    c.status = r.statusCode, o(t, c)
                }
            })
    };
    "undefined" != typeof module && module.exports && (module.exports = ajax);
    var PouchUtils;
    "undefined" != typeof module && module.exports && (PouchUtils = require("./pouch.utils.js"));
    var Pouch = function Pouch(e, t, n) {
        if (!(this instanceof Pouch)) return new Pouch(e, t, n);
        ("function" == typeof t || t === void 0) && (n = t, t = {}), "object" == typeof e && (t = e, e = void 0), n ===
            void 0 && (n = function () { });
        var o = Pouch.parseAdapter(t.name || e);
        if (t.originalName = e, t.name = t.name || o.name, t.adapter = t.adapter || o.adapter, !Pouch.adapters[t.adapter])
            throw "Adapter is missing";
        if (!Pouch.adapters[t.adapter].valid()) throw "Invalid Adapter";
        var r = new PouchAdapter(t, function (e, t) {
            if (e) return n && n(e), void 0;
            for (var o in Pouch.plugins) {
                var r = Pouch.plugins[o](t);
                for (var i in r) i in t || (t[i] = r[i])
            }
            t.taskqueue.ready(!0), t.taskqueue.execute(t), n(null, t)
        });
        for (var i in r) this[i] = r[i];
        for (var a in Pouch.plugins) {
            var u = Pouch.plugins[a](this);
            for (var s in u) s in this || (this[s] = u[s])
        }
    };
    if (Pouch.DEBUG = !1, Pouch.openReqList = {}, Pouch.adapters = {}, Pouch.plugins = {}, Pouch.prefix = "_pouch_",
        Pouch.parseAdapter = function (e) {
            var t, n = e.match(/([a-z\-]*):\/\/(.*)/);
            if (n) {
                if (e = /http(s?)/.test(n[1]) ? n[1] + "://" + n[2] : n[2], t = n[1], !Pouch.adapters[t].valid())
                    throw "Invalid adapter";
                return {
        name: e,
        adapter: n[1]
    }
    }
            for (var o = ["idb", "leveldb", "websql"], r = 0; o.length > r; ++r)
                if (o[r] in Pouch.adapters) {
                    t = Pouch.adapters[o[r]];
                    var i = "use_prefix" in t ? t.use_prefix : !0;
                    return {
        name: i ? Pouch.prefix + e : e,
        adapter: o[r]
    }
    }
            throw "No valid adapter found"
    }, Pouch.destroy = function (e, t) {
            var n = Pouch.parseAdapter(e),
                o = function (o) {
                    if (o) return t(o), void 0;
                    for (var r in Pouch.plugins) Pouch.plugins[r]._delete(e);
                    Pouch.DEBUG && console.log(e + ": Delete Database"), Pouch.adapters[n.adapter].destroy(n.name,
                        t)
    };
            Pouch.removeFromAllDbs(n, o)
    }, Pouch.removeFromAllDbs = function (e, t) {
            if (!Pouch.enableAllDbs) return t(), void 0;
            var n = e.adapter;
            return "http" === n || "https" === n ? (t(), void 0) : (new Pouch(Pouch.allDBName(e.adapter), function (
                n, o) {
                if (n) return console.error(n), t(), void 0;
                var r = Pouch.dbName(e.adapter, e.name);
                o.get(r, function (e, n) {
                    e ? t() : o.remove(n, function (e) {
                        e && console.error(e), t()
    })
    })
    }), void 0)
    }, Pouch.adapter = function (e, t) {
            t.valid() && (Pouch.adapters[e] = t)
    }, Pouch.plugin = function (e, t) {
            Pouch.plugins[e] = t
    }, Pouch.enableAllDbs = !1, Pouch.ALL_DBS = "_allDbs", Pouch.dbName = function (e, t) {
            return [e, "-", t].join("")
    }, Pouch.realDBName = function (e, t) {
            return [e, "://", t].join("")
    }, Pouch.allDBName = function (e) {
            return [e, "://", Pouch.prefix + Pouch.ALL_DBS].join("")
    }, Pouch.open = function (e, t) {
            if (!Pouch.enableAllDbs) return t(), void 0;
            var n = e.adapter;
            return "http" === n || "https" === n ? (t(), void 0) : (new Pouch(Pouch.allDBName(n), function (o, r) {
                if (o) return console.error(o), t(), void 0;
                var i = Pouch.dbName(n, e.name);
                r.get(i, function (n) {
                    n && 404 === n.status ? r.put({
        _id: i,
        dbname: e.originalName
    }, function (e) {
                        e && console.error(e), t()
    }) : t()
    })
    }), void 0)
    }, Pouch.allDbs = function (e) {
            var t = function (n, o) {
                if (0 === n.length) {
                    var r = [];
                    return o.forEach(function (e) {
                        var t = r.some(function (t) {
                            return t.id === e.id
    });
                        t || r.push(e)
    }), e(null, r.map(function (e) {
                        return e.doc.dbname
    })), void 0
    }
                var i = n.shift();
                return "http" === i || "https" === i ? (t(n, o), void 0) : (new Pouch(Pouch.allDBName(i), function (
                    r, i) {
                    return r ? (e(r), void 0) : (i.allDocs({
        include_docs: !0
    }, function (r, i) {
                        return r ? (e(r), void 0) : (o.unshift.apply(o, i.rows), t(n, o), void 0)
    }), void 0)
    }), void 0)
    }, n = Object.keys(Pouch.adapters);
            t(n, [])
    }, Pouch.uuids = function (e, t) {
            "object" != typeof t && (t = {});
            for (var n = t.length, o = t.radix, r = []; e > r.push(PouchUtils.uuid(n, o)) ;);
            return r
    }, Pouch.uuid = function (e) {
            return Pouch.uuids(1, e)[0]
    }, Pouch.Errors = {
        MISSING_BULK_DOCS: {
        status: 400,
        error: "bad_request",
        reason: "Missing JSON list of 'docs'"
    },
        MISSING_DOC: {
        status: 404,
        error: "not_found",
        reason: "missing"
    },
        REV_CONFLICT: {
        status: 409,
        error: "conflict",
        reason: "Document update conflict"
    },
        INVALID_ID: {
        status: 400,
        error: "invalid_id",
        reason: "_id field must contain a string"
    },
        MISSING_ID: {
        status: 412,
        error: "missing_id",
        reason: "_id is required for puts"
    },
        RESERVED_ID: {
        status: 400,
        error: "bad_request",
        reason: "Only reserved document ids may start with underscore."
    },
        NOT_OPEN: {
        status: 412,
        error: "precondition_failed",
        reason: "Database not open so cannot close"
    },
        UNKNOWN_ERROR: {
        status: 500,
        error: "unknown_error",
        reason: "Database encountered an unknown error"
    },
        BAD_ARG: {
        status: 500,
        error: "badarg",
        reason: "Some query argument is invalid"
    },
        INVALID_REQUEST: {
        status: 400,
        error: "invalid_request",
        reason: "Request was invalid"
    },
        QUERY_PARSE_ERROR: {
        status: 400,
        error: "query_parse_error",
        reason: "Some query parameter is invalid"
    },
        DOC_VALIDATION: {
        status: 500,
        error: "doc_validation",
        reason: "Bad special document member"
    },
        BAD_REQUEST: {
        status: 400,
        error: "bad_request",
        reason: "Something wrong with the request"
    },
        NOT_AN_OBJECT: {
        status: 400,
        error: "bad_request",
        reason: "Document must be a JSON object"
    }
    }, Pouch.error = function (e, t) {
            return PouchUtils.extend({}, e, {
        reason: t
    })
    }, "undefined" != typeof module && module.exports) {
        global.Pouch = Pouch, global.PouchDB = Pouch, module.exports = Pouch, Pouch.replicate = require(
            "./pouch.replicate.js").replicate;
        var PouchAdapter = require("./pouch.adapter.js"),
            adapters = ["leveldb", "http"];
        adapters.map(function (e) {
            require("./adapters/pouch." + e + ".js")
        }), require("./plugins/pouchdb.mapreduce.js")
    } else window.Pouch = Pouch, window.PouchDB = Pouch;
    var pouchCollate = function (e, t) {
        var n = collationIndex(e),
            o = collationIndex(t);
        return 0 !== n - o ? n - o : null === e ? 0 : "number" == typeof e ? e - t : "boolean" == typeof e ? t > e ? -
            1 : 1 : "string" == typeof e ? stringCollate(e, t) : Array.isArray(e) ? arrayCollate(e, t) : "object" ==
            typeof e ? objectCollate(e, t) : void 0
    }, stringCollate = function (e, t) {
        return e === t ? 0 : e > t ? 1 : -1
    }, objectCollate = function (e, t) {
        for (var n = Object.keys(e), o = Object.keys(t), r = Math.min(n.length, o.length), i = 0; r > i; i++) {
            var a = pouchCollate(n[i], o[i]);
            if (0 !== a) return a;
            if (a = pouchCollate(e[n[i]], t[o[i]]), 0 !== a) return a
        }
        return n.length === o.length ? 0 : n.length > o.length ? 1 : -1
    }, arrayCollate = function (e, t) {
        for (var n = Math.min(e.length, t.length), o = 0; n > o; o++) {
            var r = pouchCollate(e[o], t[o]);
            if (0 !== r) return r
        }
        return e.length === t.length ? 0 : e.length > t.length ? 1 : -1
    }, collationIndex = function (e) {
        var t = ["boolean", "number", "string", "object"];
        return -1 !== t.indexOf(typeof e) ? null === e ? 1 : t.indexOf(typeof e) + 2 : Array.isArray(e) ? 4.5 :
            void 0
    };
    "undefined" != typeof module && module.exports && (module.exports = pouchCollate);
    var extend;
    "undefined" != typeof module && module.exports && (extend = require("./deps/extend"));
    var PouchMerge = {};
    PouchMerge.merge = function (e, t, n) {
        e = extend(!0, [], e), t = extend(!0, {}, t);
        var o = doMerge(e, t);
        return {
            tree: stem(o.tree, n),
            conflicts: o.conflicts
        }
    }, PouchMerge.winningRev = function (e) {
        var t = [];
        return PouchMerge.traverseRevTree(e.rev_tree, function (e, n, o, r, i) {
            e && t.push({
                pos: n,
                id: o,
                deleted: !!i.deleted
            })
        }), t.sort(function (e, t) {
            return e.deleted !== t.deleted ? e.deleted > t.deleted ? 1 : -1 : e.pos !== t.pos ? t.pos - e.pos :
                e.id < t.id ? 1 : -1
        }), t[0].pos + "-" + t[0].id
    }, PouchMerge.traverseRevTree = function (e, t) {
        var n = [];
        for (e.forEach(function (e) {
            n.push({
            pos: e.pos,
            ids: e.ids
        })
        }) ; n.length > 0;) {
            var o = n.pop(),
                r = o.pos,
                i = o.ids,
                a = t(0 === i[2].length, r, i[0], o.ctx, i[1]);
            i[2].forEach(function (e) {
                n.push({
                    pos: r + 1,
                    ids: e,
                    ctx: a
                })
            })
        }
    }, PouchMerge.collectLeaves = function (e) {
        var t = [];
        return PouchMerge.traverseRevTree(e, function (e, n, o, r, i) {
            e && t.unshift({
                rev: n + "-" + o,
                pos: n,
                opts: i
            })
        }), t.sort(function (e, t) {
            return t.pos - e.pos
        }), t.map(function (e) {
            delete e.pos
        }), t
    }, PouchMerge.collectConflicts = function (e) {
        var t = PouchMerge.winningRev(e),
            n = PouchMerge.collectLeaves(e.rev_tree),
            o = [];
        return n.forEach(function (e) {
            e.rev === t || e.opts.deleted || o.push(e.rev)
        }), o
    }, PouchMerge.rootToLeaf = function (e) {
        var t = [];
        return PouchMerge.traverseRevTree(e, function (e, n, o, r, i) {
            if (r = r ? r.slice(0) : [], r.push({
                id: o,
                opts: i
            }), e) {
                var a = n + 1 - r.length;
                t.unshift({
                    pos: a,
                    ids: r
                })
            }
            return r
        }), t
    }, "undefined" != typeof module && module.exports && (module.exports = PouchMerge);
    var PouchUtils;
    "undefined" != typeof module && module.exports && (module.exports = Pouch, PouchUtils = require(
        "./pouch.utils.js"));
    var Promise = function () {
        this.cancelled = !1, this.cancel = function () {
            this.cancelled = !0
        }
    }, RequestManager = function () {
        var e = [],
            t = {}, n = !1;
        return t.enqueue = function (o, r) {
            e.push({
                fun: o,
                args: r
            }), n || t.process()
        }, t.process = function () {
            if (!n && e.length) {
                n = !0;
                var t = e.shift();
                t.fun.apply(null, t.args)
            }
        }, t.notifyRequestComplete = function () {
            n = !1, t.process()
        }, t
    }, genReplicationId = function (e, t, n) {
        var o = n.filter ? "" + n.filter : "";
        return "_local/" + PouchUtils.Crypto.MD5(e.id() + t.id() + o)
    }, fetchCheckpoint = function (e, t, n, o) {
        t.get(n, function (t, r) {
            t && 404 === t.status ? o(null, 0) : e.get(n, function (e, t) {
                e && 404 === e.status || r.last_seq !== t.last_seq ? o(null, 0) : o(null, t.last_seq)
            })
        })
    }, writeCheckpoint = function (e, t, n, o, r) {
        var i = {
            _id: n,
            last_seq: o
        };
        t.put(i, function () {
            e.put(i, function () {
                r()
            })
        })
    };
    Pouch.replicate = function (e, t, n, o) {
        n instanceof Function && (o = n, n = {}), void 0 === n && (n = {}), n.complete || (n.complete = o);
        var r = new Promise;
        return toPouch(e, function (e, i) {
            return e ? PouchUtils.call(o, e) : (toPouch(t, function (e, t) {
                return e ? PouchUtils.call(o, e) : (replicate(i, t, n, r), void 0)
            }), void 0)
        }), r
    };
    var PouchUtils = {};
    "undefined" != typeof module && module.exports && (PouchMerge = require("./pouch.merge.js"));
    var reservedWords = ["_id", "_rev", "_attachments", "_deleted", "_revisions", "_revs_info", "_conflicts",
        "_deleted_conflicts", "_local_seq", "_rev_tree"
    ],
        isValidId = function (e) {
            return /^_/.test(e) ? /^_(design|local)/.test(e) : !0
        }, isChromeApp = function () {
            return "undefined" != typeof chrome && chrome.storage !== void 0 && chrome.storage.local !== void 0
        };
    if (PouchUtils.call = function (e) {
        if (typeof e == typeof Function) {
            var t = Array.prototype.slice.call(arguments, 1);
            e.apply(this, t)
    }
    }, PouchUtils.isLocalId = function (e) {
        return /^_local/.test(e)
    }, PouchUtils.isDeleted = function (e, t) {
        t || (t = PouchMerge.winningRev(e)), t.indexOf("-") >= 0 && (t = t.split("-")[1]);
        var n = !1;
        return PouchMerge.traverseRevTree(e.rev_tree, function (e, o, r, i, a) {
            r === t && (n = !!a.deleted)
    }), n
    }, PouchUtils.filterChange = function (e) {
        return function (t) {
            var n = {}, o = e.filter && "function" == typeof e.filter;
            if (n.query = e.query_params, e.filter && o && !e.filter.call(this, t.doc, n)) return !1;
            if (e.doc_ids && -1 === e.doc_ids.indexOf(t.id)) return !1;
            if (e.include_docs)
                for (var r in t.doc._attachments) t.doc._attachments[r].stub = !0;
    else delete t.doc;
            return !0
    }
    }, PouchUtils.processChanges = function (e, t, n) {
        t = t.filter(PouchUtils.filterChange(e)), e.limit && e.limit < t.length && (t.length = e.limit), t.forEach(
            function (t) {
                PouchUtils.call(e.onChange, t)
    }), PouchUtils.call(e.complete, null, {
        results: t,
        last_seq: n
    })
    }, PouchUtils.parseDoc = function (e, t) {
        var n, o, r, i = null,
            a = {
        status: "available"
    };
        if (e._deleted && (a.deleted = !0), t)
            if (e._id || (e._id = Pouch.uuid()), o = Pouch.uuid({
        length: 32,
        radix: 16
    }).toLowerCase(), e._rev) {
                if (r = /^(\d+)-(.+)$/.exec(e._rev), !r) throw "invalid value for property '_rev'";
                e._rev_tree = [{
        pos: parseInt(r[1], 10),
        ids: [r[2], {
        status: "missing"
    },
                        [
                            [o, a, []]
    ]
    ]
    }], n = parseInt(r[1], 10) + 1
    } else e._rev_tree = [{
        pos: 1,
        ids: [o, a, []]
    }], n = 1;
    else if (e._revisions && (e._rev_tree = [{
        pos: e._revisions.start - e._revisions.ids.length + 1,
        ids: e._revisions.ids.reduce(function (e, t) {
                return null === e ? [t, a, []] : [t, {
        status: "missing"
    },
                    [e]
    ]
    }, null)
    }], n = e._revisions.start, o = e._revisions.ids[0]), !e._rev_tree) {
            if (r = /^(\d+)-(.+)$/.exec(e._rev), !r) return Pouch.Errors.BAD_ARG;
            n = parseInt(r[1], 10), o = r[2], e._rev_tree = [{
        pos: parseInt(r[1], 10),
        ids: [r[2], a, []]
    }]
    }
        "string" != typeof e._id ? i = Pouch.Errors.INVALID_ID : isValidId(e._id) || (i = Pouch.Errors.RESERVED_ID);
        for (var u in e) e.hasOwnProperty(u) && "_" === u[0] && -1 === reservedWords.indexOf(u) && (i = extend({},
            Pouch.Errors.DOC_VALIDATION), i.reason += ": " + u);
        return e._id = decodeURIComponent(e._id), e._rev = [n, o].join("-"), i ? i : Object.keys(e).reduce(
            function (t, n) {
                return /^_/.test(n) && "_attachments" !== n ? t.metadata[n.slice(1)] = e[n] : t.data[n] = e[n],
                    t
    }, {
        metadata: {},
        data: {}
    })
    }, PouchUtils.isCordova = function () {
        return "undefined" != typeof cordova || "undefined" != typeof PhoneGap || "undefined" != typeof phonegap
    }, PouchUtils.Changes = function () {
        var e = {}, t = {};
        return isChromeApp() ? chrome.storage.onChanged.addListener(function (t) {
            e.notify(t.db_name.newValue)
    }) : window.addEventListener("storage", function (t) {
            e.notify(t.key)
    }), e.addListener = function (e, n, o, r) {
            t[e] || (t[e] = {}), t[e][n] = {
        db: o,
        opts: r
    }
    }, e.removeListener = function (e, n) {
            delete t[e][n]
    }, e.clearListeners = function (e) {
            delete t[e]
    }, e.notifyLocalWindows = function (e) {
            isChromeApp() ? chrome.storage.local.set({
        db_name: e
    }) : localStorage[e] = "a" === localStorage[e] ? "b" : "a"
    }, e.notify = function (e) {
            t[e] && Object.keys(t[e]).forEach(function (n) {
                var o = t[e][n].opts;
                t[e][n].db.changes({
        include_docs: o.include_docs,
        conflicts: o.conflicts,
        continuous: !1,
        descending: !1,
        filter: o.filter,
        since: o.since,
        query_params: o.query_params,
        onChange: function (e) {
                        e.seq > o.since && !o.cancelled && (o.since = e.seq, PouchUtils.call(o.onChange,
                            e))
    }
    })
    })
    }, e
    }, "undefined" != typeof module && module.exports) {
        var crypto = require("crypto");
        PouchUtils.Crypto = {
            MD5: function (e) {
                return crypto.createHash("md5").update(e).digest("hex")
            }
        }, PouchUtils.atob = function (e) {
            var t = new Buffer(e, "base64");
            if (t.toString("base64") !== e) throw "Cannot base64 encode full string";
            return t.toString("binary")
        }, PouchUtils.btoa = function (e) {
            return new Buffer(e, "binary").toString("base64")
        }, PouchUtils.extend = require("./deps/extend"), PouchUtils.ajax = require("./deps/ajax"), PouchUtils.uuid =
            require("./deps/uuid"), module.exports = PouchUtils
    } else PouchUtils.Crypto = Crypto, PouchUtils.extend = extend, PouchUtils.ajax = ajax, PouchUtils.uuid = uuid,
        PouchUtils.atob = atob.bind(null), PouchUtils.btoa = btoa.bind(null);
    var PouchAdapter, PouchUtils;
    "undefined" != typeof module && module.exports && (PouchUtils = require("./pouch.utils.js"));
    var call = PouchUtils.call;
    PouchAdapter = function (e, t) {
        var n = {}, o = Pouch.adapters[e.adapter](e, function (o, r) {
            if (o) return t && t(o), void 0;
            for (var i in n) r.hasOwnProperty(i) || (r[i] = n[i]);
            e.name === Pouch.prefix + Pouch.ALL_DBS ? t(o, r) : Pouch.open(e, function (e) {
                t(e, r)
            })
        }),
            r = e.auto_compaction === !0,
            i = function (e) {
                return r ? function (t, n) {
                    if (t) call(e, t);
                    else {
                        var o = n.length,
                            r = function () {
                                o--, o || call(e, null, n)
                            };
                        n.forEach(function (e) {
                            e.ok ? a(e.id, 1, r) : r()
                        })
                    }
                } : e
            };
        n.post = function (e, t, n) {
            return "function" == typeof t && (n = t, t = {}), "object" != typeof e || Array.isArray(e) ? call(n,
                Pouch.Errors.NOT_AN_OBJECT) : o.bulkDocs({
                    docs: [e]
                }, t, i(yankError(n)))
        }, n.put = function (e, t, n) {
            return "function" == typeof t && (n = t, t = {}), "object" != typeof e ? call(n, Pouch.Errors.NOT_AN_OBJECT) :
                "_id" in e ? o.bulkDocs({
                    docs: [e]
                }, t, i(yankError(n))) : call(n, Pouch.Errors.MISSING_ID)
        }, n.putAttachment = function (e, t, o, r, i, a) {
            function u(e) {
                e._attachments = e._attachments || {}, e._attachments[t] = {
                    content_type: i,
                    data: r
                }, n.put(e, a)
            }
            return n.taskqueue.ready() ? ("function" == typeof i && (a = i, i = r, r = o, o = null), i === void 0 &&
                (i = r, r = o, o = null), n.get(e, function (t, n) {
                    return t && t.error === Pouch.Errors.MISSING_DOC.error ? (u({
                        _id: e
                    }), void 0) : t ? (call(a, t), void 0) : n._rev !== o ? (call(a, Pouch.Errors.REV_CONFLICT),
                        void 0) : (u(n), void 0)
                }), void 0) : (n.taskqueue.addTask("putAttachment", arguments), void 0)
        }, n.removeAttachment = function (e, t, o, r) {
            n.get(e, function (e, i) {
                return e ? (call(r, e), void 0) : i._rev !== o ? (call(r, Pouch.Errors.REV_CONFLICT), void 0) :
                    i._attachments ? (delete i._attachments[t], 0 === Object.keys(i._attachments).length &&
                        delete i._attachments, n.put(i, r), void 0) : call(r, null)
            })
        }, n.remove = function (e, t, n) {
            "function" == typeof t && (n = t, t = {}), void 0 === t && (t = {}), t.was_delete = !0;
            var r = {
                _id: e._id,
                _rev: e._rev
            };
            return r._deleted = !0, o.bulkDocs({
                docs: [r]
            }, t, yankError(n))
        }, n.revsDiff = function (e, t, o) {
            function r(t, n, r) {
                return e[r].map(function (e) {
                    var t = function (t) {
                        return t.rev !== e
                    };
                    (!n || n._revs_info.every(t)) && (u[r] || (u[r] = {
                        missing: []
                    }), u[r].missing.push(e))
                }), ++a === i.length ? call(o, null, u) : void 0
            }
            "function" == typeof t && (o = t, t = {});
            var i = Object.keys(e),
                a = 0,
                u = {};
            i.map(function (e) {
                n.get(e, {
                    revs_info: !0
                }, function (t, n) {
                    r(t, n, e)
                })
            })
        };
        var a = function (e, t, n) {
            o._getRevisionTree(e, function (r, i) {
                if (r) return call(n);
                var a = computeHeight(i),
                    u = [],
                    s = [];
                Object.keys(a).forEach(function (e) {
                    a[e] > t && u.push(e)
                }), PouchMerge.traverseRevTree(i, function (e, t, n, o, r) {
                    var i = t + "-" + n;
                    "available" === r.status && -1 !== u.indexOf(i) && (r.status = "missing", s.push(i))
                }), o._doCompaction(e, i, s, n)
            })
        };
        n.compact = function (e) {
            n.changes({
                complete: function (t, n) {
                    if (t) return call(e), void 0;
                    var o = n.results.length;
                    return o ? (n.results.forEach(function (t) {
                        a(t.id, 0, function () {
                            o--, o || call(e)
                        })
                    }), void 0) : (call(e), void 0)
                }
            })
        }, n.get = function (e, t, r) {
            function i() {
                var o = [],
                    i = a.length;
                return i ? (a.forEach(function (a) {
                    n.get(e, {
                        rev: a,
                        revs: t.revs
                    }, function (e, t) {
                        e ? o.push({
                            missing: a
                        }) : o.push({
                            ok: t
                        }), i--, i || call(r, null, o)
                    })
                }), void 0) : call(r, null, o)
            }
            if (!n.taskqueue.ready()) return n.taskqueue.addTask("get", arguments), void 0;
            "function" == typeof t && (r = t, t = {});
            var a = []; {
                if (!t.open_revs) return o._get(e, t, function (e, n) {
                    if (e) return call(r, e);
                    var i = n.doc,
                        a = n.metadata,
                        u = n.ctx;
                    if (t.conflicts) {
                        var s = PouchMerge.collectConflicts(a);
                        s.length && (i._conflicts = s)
                    }
                    if (t.revs || t.revs_info) {
                        var c = PouchMerge.rootToLeaf(a.rev_tree),
                            l = arrayFirst(c, function (e) {
                                return -1 !== e.ids.map(function (e) {
                                    return e.id
                                }).indexOf(i._rev.split("-")[1])
                            });
                        if (l.ids.splice(l.ids.map(function (e) {
                            return e.id
                        }).indexOf(i._rev.split("-")[1]) + 1), l.ids.reverse(), t.revs && (i._revisions = {
                            start: l.pos + l.ids.length - 1,
                            ids: l.ids.map(function (e) {
                                return e.id
                        })
                        }), t.revs_info) {
                            var d = l.pos + l.ids.length;
                            i._revs_info = l.ids.map(function (e) {
                                return d--, {
                                    rev: d + "-" + e.id,
                                    status: e.opts.status
                                }
                            })
                        }
                    }
                    if (t.local_seq && (i._local_seq = n.metadata.seq), t.attachments && i._attachments) {
                        var f = i._attachments,
                            h = Object.keys(f).length;
                        if (0 === h) return call(r, null, i);
                        Object.keys(f).forEach(function (e) {
                            o._getAttachment(f[e], {
                                encode: !0,
                                ctx: u
                            }, function (t, n) {
                                i._attachments[e].data = n, --h || call(r, null, i)
                            })
                        })
                    } else {
                        if (i._attachments)
                            for (var p in i._attachments) i._attachments[p].stub = !0;
                        call(r, null, i)
                    }
                });
                if ("all" === t.open_revs) o._getRevisionTree(e, function (e, t) {
                    e && (t = []), a = PouchMerge.collectLeaves(t).map(function (e) {
                        return e.rev
                    }), i()
                });
                else {
                    if (!Array.isArray(t.open_revs)) return call(r, Pouch.error(Pouch.Errors.UNKNOWN_ERROR,
                        "function_clause"));
                    a = t.open_revs;
                    for (var u = 0; a.length > u; u++) {
                        var s = a[u];
                        if ("string" != typeof s || !/^\d+-/.test(s)) return call(r, Pouch.error(Pouch.Errors.BAD_REQUEST,
                            "Invalid rev format"))
                    }
                    i()
                }
            }
        }, n.getAttachment = function (e, t, r, i) {
            return n.taskqueue.ready() ? (r instanceof Function && (i = r, r = {}), o._get(e, r, function (e, n) {
                return e ? call(i, e) : n.doc._attachments && n.doc._attachments[t] ? (r.ctx = n.ctx, o._getAttachment(
                    n.doc._attachments[t], r, i), void 0) : call(i, Pouch.Errors.MISSING_DOC)
            }), void 0) : (n.taskqueue.addTask("getAttachment", arguments), void 0)
        }, n.allDocs = function (e, t) {
            if (!n.taskqueue.ready()) return n.taskqueue.addTask("allDocs", arguments), void 0;
            if ("function" == typeof e && (t = e, e = {}), "keys" in e) {
                if ("startkey" in e) return call(t, Pouch.error(Pouch.Errors.QUERY_PARSE_ERROR,
                    "Query parameter `start_key` is not compatible with multi-get")), void 0;
                if ("endkey" in e) return call(t, Pouch.error(Pouch.Errors.QUERY_PARSE_ERROR,
                    "Query parameter `end_key` is not compatible with multi-get")), void 0
            }
            return o._allDocs(e, t)
        }, n.changes = function (e) {
            return n.taskqueue.ready() ? (e = PouchUtils.extend(!0, {}, e), e.since || (e.since = 0), "descending" in
                e || (e.descending = !1), e.limit = 0 === e.limit ? 1 : e.limit, o._changes(e)) : (n.taskqueue.addTask(
                "changes", arguments), void 0)
        }, n.close = function (e) {
            return n.taskqueue.ready() ? o._close(e) : (n.taskqueue.addTask("close", arguments), void 0)
        }, n.info = function (e) {
            return n.taskqueue.ready() ? o._info(e) : (n.taskqueue.addTask("info", arguments), void 0)
        }, n.id = function () {
            return o._id()
        }, n.type = function () {
            return "function" == typeof o._type ? o._type() : e.adapter
        }, n.bulkDocs = function (e, t, r) {
            if (!n.taskqueue.ready()) return n.taskqueue.addTask("bulkDocs", arguments), void 0;
            if ("function" == typeof t && (r = t, t = {}), t = t ? PouchUtils.extend(!0, {}, t) : {}, !e || !e.docs ||
                1 > e.docs.length) return call(r, Pouch.Errors.MISSING_BULK_DOCS);
            if (!Array.isArray(e.docs)) return call(r, Pouch.Errors.QUERY_PARSE_ERROR);
            for (var a = 0; e.docs.length > a; ++a)
                if ("object" != typeof e.docs[a] || Array.isArray(e.docs[a])) return call(r, Pouch.Errors.NOT_AN_OBJECT);
            return e = PouchUtils.extend(!0, {}, e), "new_edits" in t || (t.new_edits = !0), o._bulkDocs(e, t, i(r))
        };
        var u = {};
        u.ready = !1, u.queue = [], n.taskqueue = {}, n.taskqueue.execute = function (e) {
            u.ready && u.queue.forEach(function (t) {
                e[t.task].apply(null, t.parameters)
            })
        }, n.taskqueue.ready = function () {
            return 0 === arguments.length ? u.ready : (u.ready = arguments[0], void 0)
        }, n.taskqueue.addTask = function (e, t) {
            u.queue.push({
                task: e,
                parameters: t
            })
        }, n.replicate = {}, n.replicate.from = function (e, t, n) {
            return "function" == typeof t && (n = t, t = {}), Pouch.replicate(e, o, t, n)
        }, n.replicate.to = function (e, t, n) {
            return "function" == typeof t && (n = t, t = {}), Pouch.replicate(o, e, t, n)
        };
        for (var s in n) o.hasOwnProperty(s) || (o[s] = n[s]);
        return e.skipSetup && (n.taskqueue.ready(!0), n.taskqueue.execute(n)), PouchUtils.isCordova() && cordova.fireWindowEvent(
            e.name + "_pouch", {}), o
    }, "undefined" != typeof module && module.exports && (module.exports = PouchAdapter);
    var PouchUtils;
    "undefined" != typeof module && module.exports && (Pouch = require("../pouch.js"), PouchUtils = require(
        "../pouch.utils.js"));
    var ajax = PouchUtils.ajax,
        HTTP_TIMEOUT = 1e4;
    parseUri.options = {
        strictMode: !1,
        key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path",
            "directory", "file", "query", "anchor"
        ],
        q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    };
    var HttpPouch = function (e, t) {
        var n = getHost(e.name);
        if (n.headers = e.headers || {}, e.auth) {
            var o = PouchUtils.btoa(e.auth.username + ":" + e.auth.password);
            n.headers.Authorization = "Basic " + o
        }
        e.headers && (n.headers = e.headers);
        var r = genDBUrl(n, ""),
            i = {}, a = {
                list: [],
                get: function (e, t) {
                    "function" == typeof e && (t = e, e = {
                        count: 10
                    });
                    var o = function (e, n) {
                        !e && "uuids" in n ? (a.list = a.list.concat(n.uuids), PouchUtils.call(t, null, "OK")) :
                            PouchUtils.call(t, e || Pouch.Errors.UNKNOWN_ERROR)
                    }, r = "?count=" + e.count;
                    ajax({
                        headers: n.headers,
                        method: "GET",
                        url: genUrl(n, "_uuids") + r
                    }, o)
                }
            }, u = function () {
                ajax({
                    headers: n.headers,
                    method: "PUT",
                    url: r
                }, function (e) {
                    e && 401 === e.status ? ajax({
                        headers: n.headers,
                        method: "HEAD",
                        url: r
                    }, function (e) {
                        e ? PouchUtils.call(t, e) : PouchUtils.call(t, null, i)
                    }) : e && 412 !== e.status ? PouchUtils.call(t, Pouch.Errors.UNKNOWN_ERROR) : PouchUtils.call(
                        t, null, i)
                })
            };
        return e.skipSetup || ajax({
            headers: n.headers,
            method: "GET",
            url: r
        }, function (e) {
            e ? 404 === e.status ? u() : PouchUtils.call(t, e) : PouchUtils.call(t, null, i)
        }), i.type = function () {
            return "http"
        }, i.id = function () {
            return genDBUrl(n, "")
        }, i.request = function (e, t) {
            return i.taskqueue.ready() ? (e.headers = n.headers, e.url = genDBUrl(n, e.url), ajax(e, t), void 0) :
                (i.taskqueue.addTask("request", arguments), void 0)
        }, i.compact = function (e, t) {
            return i.taskqueue.ready() ? ("function" == typeof e && (t = e, e = {}), ajax({
                headers: n.headers,
                url: genDBUrl(n, "_compact"),
                method: "POST"
            }, function () {
                function n() {
                    i.info(function (o, r) {
                        r.compact_running ? setTimeout(n, e.interval || 200) : PouchUtils.call(t, null)
                    })
                }
                "function" == typeof t && n()
            }), void 0) : (i.taskqueue.addTask("compact", arguments), void 0)
        }, i.info = function (e) {
            return i.taskqueue.ready() ? (ajax({
                headers: n.headers,
                method: "GET",
                url: genDBUrl(n, "")
            }, e), void 0) : (i.taskqueue.addTask("info", arguments), void 0)
        }, i.get = function (e, t, o) {
            if (!i.taskqueue.ready()) return i.taskqueue.addTask("get", arguments), void 0;
            "function" == typeof t && (o = t, t = {}), void 0 === t.auto_encode && (t.auto_encode = !0);
            var r = [];
            t.revs && r.push("revs=true"), t.revs_info && r.push("revs_info=true"), t.local_seq && r.push(
                "local_seq=true"), t.open_revs && ("all" !== t.open_revs && (t.open_revs = JSON.stringify(t.open_revs)),
                r.push("open_revs=" + t.open_revs)), t.attachments && r.push("attachments=true"), t.rev && r.push(
                "rev=" + t.rev), t.conflicts && r.push("conflicts=" + t.conflicts), r = r.join("&"), r = "" === r ?
                "" : "?" + r, t.auto_encode && (e = encodeDocId(e));
            var a = {
                headers: n.headers,
                method: "GET",
                url: genDBUrl(n, e + r)
            }, u = e.split("/");
            (u.length > 1 && "_design" !== u[0] && "_local" !== u[0] || u.length > 2 && "_design" === u[0] &&
                "_local" !== u[0]) && (a.binary = !0), ajax(a, function (e, t, n) {
                    return e ? PouchUtils.call(o, e) : (PouchUtils.call(o, null, t, n), void 0)
                })
        }, i.remove = function (e, t, o) {
            return i.taskqueue.ready() ? ("function" == typeof t && (o = t, t = {}), ajax({
                headers: n.headers,
                method: "DELETE",
                url: genDBUrl(n, encodeDocId(e._id)) + "?rev=" + e._rev
            }, o), void 0) : (i.taskqueue.addTask("remove", arguments), void 0)
        }, i.getAttachment = function (e, t, n, o) {
            "function" == typeof n && (o = n, n = {}), void 0 === n.auto_encode && (n.auto_encode = !0), n.auto_encode &&
                (e = encodeDocId(e)), n.auto_encode = !1, i.get(e + "/" + t, n, o)
        }, i.removeAttachment = function (e, t, o, r) {
            return i.taskqueue.ready() ? (ajax({
                headers: n.headers,
                method: "DELETE",
                url: genDBUrl(n, encodeDocId(e) + "/" + t) + "?rev=" + o
            }, r), void 0) : (i.taskqueue.addTask("removeAttachment", arguments), void 0)
        }, i.putAttachment = function (e, t, o, r, a, u) {
            if (!i.taskqueue.ready()) return i.taskqueue.addTask("putAttachment", arguments), void 0;
            "function" == typeof a && (u = a, a = r, r = o, o = null), a === void 0 && (a = r, r = o, o = null);
            var s = encodeDocId(e) + "/" + t,
                c = genDBUrl(n, s);
            o && (c += "?rev=" + o);
            var l = {
                headers: n.headers,
                method: "PUT",
                url: c,
                processData: !1,
                body: r,
                timeout: 6e4
            };
            l.headers["Content-Type"] = a, ajax(l, u)
        }, i.put = function (e, t, o) {
            if (!i.taskqueue.ready()) return i.taskqueue.addTask("put", arguments), void 0;
            if ("function" == typeof t && (o = t, t = {}), "object" != typeof e) return PouchUtils.call(o, Pouch.Errors
                .NOT_AN_OBJECT);
            if (!("_id" in e)) return PouchUtils.call(o, Pouch.Errors.MISSING_ID);
            var r = [];
            t && t.new_edits !== void 0 && r.push("new_edits=" + t.new_edits), r = r.join("&"), "" !== r && (r =
                "?" + r), ajax({
                    headers: n.headers,
                    method: "PUT",
                    url: genDBUrl(n, encodeDocId(e._id)) + r,
                    body: e
                }, o)
        }, i.post = function (e, t, n) {
            return i.taskqueue.ready() ? ("function" == typeof t && (n = t, t = {}), "object" != typeof e ?
                PouchUtils.call(n, Pouch.Errors.NOT_AN_OBJECT) : ("_id" in e ? i.put(e, t, n) : a.list.length > 0 ?
                    (e._id = a.list.pop(), i.put(e, t, n)) : a.get(function (o) {
                        return o ? PouchUtils.call(n, Pouch.Errors.UNKNOWN_ERROR) : (e._id = a.list.pop(), i.put(
                            e, t, n), void 0)
                    }), void 0)) : (i.taskqueue.addTask("post", arguments), void 0)
        }, i.bulkDocs = function (e, t, o) {
            return i.taskqueue.ready() ? ("function" == typeof t && (o = t, t = {}), t || (t = {}), t.new_edits !==
                void 0 && (e.new_edits = t.new_edits), ajax({
                    headers: n.headers,
                    method: "POST",
                    url: genDBUrl(n, "_bulk_docs"),
                    body: e
                }, o), void 0) : (i.taskqueue.addTask("bulkDocs", arguments), void 0)
        }, i.allDocs = function (e, t) {
            if (!i.taskqueue.ready()) return i.taskqueue.addTask("allDocs", arguments), void 0;
            "function" == typeof e && (t = e, e = {});
            var o, r = [],
                a = "GET";
            e.conflicts && r.push("conflicts=true"), e.descending && r.push("descending=true"), e.include_docs && r
                .push("include_docs=true"), e.startkey && r.push("startkey=" + encodeURIComponent(JSON.stringify(e.startkey))),
                e.endkey && r.push("endkey=" + encodeURIComponent(JSON.stringify(e.endkey))), e.limit && r.push(
                    "limit=" + e.limit), r = r.join("&"), "" !== r && (r = "?" + r), e.keys !== void 0 && (a =
                    "POST", o = JSON.stringify({
                        keys: e.keys
                    })), ajax({
                        headers: n.headers,
                        method: a,
                        url: genDBUrl(n, "_all_docs" + r),
                        body: o
                    }, t)
        }, i.changes = function (e) {
            var t = 25;
            if (!i.taskqueue.ready()) return i.taskqueue.addTask("changes", arguments), void 0;
            Pouch.DEBUG && console.log(r + ": Start Changes Feed: continuous=" + e.continuous);
            var o = {}, a = e.limit !== void 0 ? e.limit : !1;
            0 === a && (a = 1);
            var u = a;
            if (e.style && (o.style = e.style), (e.include_docs || e.filter && "function" == typeof e.filter) && (o
                    .include_docs = !0), e.continuous && (o.feed = "longpoll"), e.conflicts && (o.conflicts = !0),
                e.descending && (o.descending = !0), e.filter && "string" == typeof e.filter && (o.filter = e.filter),
                e.query_params && "object" == typeof e.query_params)
                for (var s in e.query_params) e.query_params.hasOwnProperty(s) && (o[s] = e.query_params[s]);
            var c, l, d, f = function (r, i) {
                o.since = r, o.limit = !a || u > t ? t : u;
                var s = "?" + Object.keys(o).map(function (e) {
                    return e + "=" + o[e]
                }).join("&"),
                    d = {
                        headers: n.headers,
                        method: "GET",
                        url: genDBUrl(n, "_changes" + s),
                        timeout: null
                    };
                l = r, e.aborted || (c = ajax(d, i))
            }, h = 10,
                p = 0,
                v = {
                    results: []
                }, _ = function (t, n) {
                    if (n && n.results) {
                        v.last_seq = n.last_seq;
                        var o = {};
                        o.query = e.query_params, n.results = n.results.filter(function (t) {
                            u--;
                            var n = PouchUtils.filterChange(e)(t);
                            return n && (v.results.push(t), PouchUtils.call(e.onChange, t)), n
                        })
                    }
                    n && n.last_seq && (l = n.last_seq);
                    var r = n && n.results.length || 0,
                        i = a && 0 >= u || n && !r || r && n.last_seq === d || e.descending && 0 !== l;
                    if (e.continuous || !i) {
                        t ? p += 1 : p = 0;
                        var s = 1 << p,
                            c = h * s,
                            m = e.maximumWait || 3e4;
                        c > m && PouchUtils.call(e.complete, t || Pouch.Errors.UNKNOWN_ERROR, null), setTimeout(
                            function () {
                                f(l, _)
                            }, c)
                    } else PouchUtils.call(e.complete, null, v)
                };
            return e.continuous ? f(e.since || 0, _) : i.info(function (t, n) {
                return t ? PouchUtils.call(e.complete, t) : (d = n.update_seq, f(e.since || 0, _), void 0)
            }), {
                cancel: function () {
                    Pouch.DEBUG && console.log(r + ": Cancel Changes Feed"), e.aborted = !0, c.abort()
                }
            }
        }, i.revsDiff = function (e, t, o) {
            return i.taskqueue.ready() ? ("function" == typeof t && (o = t, t = {}), ajax({
                headers: n.headers,
                method: "POST",
                url: genDBUrl(n, "_revs_diff"),
                body: e
            }, function (e, t) {
                PouchUtils.call(o, e, t)
            }), void 0) : (i.taskqueue.addTask("revsDiff", arguments), void 0)
        }, i.close = function (e) {
            return i.taskqueue.ready() ? (PouchUtils.call(e, null), void 0) : (i.taskqueue.addTask("close",
                arguments), void 0)
        }, i
    };
    HttpPouch.destroy = function (e, t) {
        var n = getHost(e);
        ajax({
            headers: n.headers,
            method: "DELETE",
            url: genDBUrl(n, "")
        }, t)
    }, HttpPouch.valid = function () {
        return !0
    }, Pouch.adapter("http", HttpPouch), Pouch.adapter("https", HttpPouch);
    var idbError = function (e) {
        return function (t) {
            PouchUtils.call(e, {
                status: 500,
                error: t.type,
                reason: t.target
            })
        }
    }, IdbPouch = function (opts, callback) {
        function createSchema(e) {
            e.createObjectStore(DOC_STORE, {
                keyPath: "id"
            }).createIndex("seq", "seq", {
                unique: !0
            }), e.createObjectStore(BY_SEQ_STORE, {
                autoIncrement: !0
            }).createIndex("_doc_id_rev", "_doc_id_rev", {
                unique: !0
            }), e.createObjectStore(ATTACH_STORE, {
                keyPath: "digest"
            }), e.createObjectStore(META_STORE, {
                keyPath: "id",
                autoIncrement: !1
            }), e.createObjectStore(DETECT_BLOB_SUPPORT_STORE)
        }

        function fixBinary(e) {
            for (var t = e.length, n = new ArrayBuffer(t), o = new Uint8Array(n), r = 0; t > r; r++) o[r] = e.charCodeAt(
                r);
            return n
        }

        function sortByBulkSeq(e, t) {
            return e._bulk_seq - t._bulk_seq
        }
        var POUCH_VERSION = 1,
            DOC_STORE = "document-store",
            BY_SEQ_STORE = "by-sequence",
            ATTACH_STORE = "attach-store",
            META_STORE = "meta-store",
            DETECT_BLOB_SUPPORT_STORE = "detect-blob-support",
            name = opts.name,
            req = window.indexedDB.open(name, POUCH_VERSION);
        Pouch.openReqList && (Pouch.openReqList[name] = req);
        var blobSupport = null,
            instanceId = null,
            api = {}, idb = null;
        return Pouch.DEBUG && console.log(name + ": Open Database"), req.onupgradeneeded = function (e) {
            for (var t = e.target.result, n = e.oldVersion; n !== e.newVersion;) 0 === n && createSchema(t), n++
        },


            req.onsuccess = function (e) {

                idb = e.target.result;

                var txn = idb.transaction([META_STORE, DETECT_BLOB_SUPPORT_STORE],
                                          'readwrite');

                idb.onversionchange = function () {
                    idb.close();
                };

                // polyfill the new onupgradeneeded api for chrome. can get rid of when
                // saucelabs moves to chrome 23
                if (idb.setVersion && Number(idb.version) !== POUCH_VERSION) {
                    var versionReq = idb.setVersion(POUCH_VERSION);
                    versionReq.onsuccess = function (evt) {
                        function setVersionComplete() {
                            req.onsuccess(e);
                        }
                        evt.target.result.oncomplete = setVersionComplete;
                        req.onupgradeneeded(e);
                    };
                    return;
                }

                var req = txn.objectStore(META_STORE).get(META_STORE);

                req.onsuccess = function (e) {
                    var meta = e.target.result || { id: META_STORE };
                    if (name + '_id' in meta) {
                        instanceId = meta[name + '_id'];
                    } else {
                        instanceId = Pouch.uuid();
                        meta[name + '_id'] = instanceId;
                        txn.objectStore(META_STORE).put(meta);
                    }
                    //YSG Add BlobSupport to PouchDB API
                    // detect blob support
                    try {
                        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(new Blob(), "key");
                        blobSupport = true;
                        PouchDB.BlobSupport = "Binary";
                    } catch (err) {
                        blobSupport = false;
                        PouchDB.BlobSupport = "Base64";
                    } finally {
                        PouchUtils.call(callback, null, api);
                    }
                };
            },


            req.onerror = idbError(callback), api.type = function () {
                return "idb"
            }, api.id = function idb_id() {
                return instanceId
            }, api._bulkDocs = function idb_bulkDocs(e, t, n) {
                function o(e) {
                    var t = e.target.result;
                    t.updateSeq = (t.updateSeq || 0) + y, m.objectStore(META_STORE).put(t)
                }

                function r() {
                    if (!v.length) return m.objectStore(META_STORE).get(META_STORE).onsuccess = o, void 0;
                    var e = v.shift(),
                        t = m.objectStore(DOC_STORE).get(e.metadata.id);
                    t.onsuccess = function (t) {
                        var n = t.target.result;
                        n ? c(n, e) : l(e)
                    }
                }

                function i() {
                    var e = [];
                    g.sort(sortByBulkSeq), g.forEach(function (t) {
                        if (delete t._bulk_seq, t.error) return e.push(t), void 0;
                        var n = t.metadata,
                            o = PouchMerge.winningRev(n);
                        e.push({
                            ok: !0,
                            id: n.id,
                            rev: o
                        }), PouchUtils.isLocalId(n.id) || (IdbPouch.Changes.notify(name), IdbPouch.Changes.notifyLocalWindows(
                            name))
                    }), PouchUtils.call(n, null, e)
                }

                //YSG - Use Uint8Array for MD5 algorithm
                // function preprocessAttachment(att, finish) {
                function a(att, finish) {
                    if (att.stub) {
                        return finish();
                    }
                    if (typeof att.data === 'string') {
                        var data;
                        try {
                            data = atob(att.data);
                        } catch (e) {
                            var err = Pouch.error(Pouch.Errors.BAD_ARG,
                                                  "Attachments need to be base64 encoded");
                            return PouchUtils.call(callback, err);
                        }
                        var buffer = new Uint8Array(data);
                        att.digest = 'md5-' + XUtils.Crypto.MD5(buffer);
                        if (blobSupport) {
                            var type = att.content_type;
                            data = fixBinary(data);
                            att.data = new Blob([data], { type: type });
                        }
                        return finish();
                    }
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                        var buffer = new Uint8Array(this.result);
                        att.digest = 'md5-' + XUtils.Crypto.MD5(buffer);
                        att.data.md5 = att.digest;
                        if (!blobSupport) {
                            att.data = arrayBufferToBase64(this.result);
                        }
                        finish();
                    };
                    reader.readAsArrayBuffer(att.data);
                }
                
                function arrayBufferToBase64(buffer) {
                    var binary = '';
                    var bytes = new Uint8Array(buffer);
                    var len = bytes.byteLength;
                    for (var i = 0; i < len; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    return window.btoa(binary);
                }

                function u(e) {
                    function t() {
                        n++, v.length === n && e()
                    }
                    if (!v.length) return e();
                    var n = 0;
                    v.forEach(function (e) {
                        function n() {
                            r++, r === o.length && t()
                        }
                        var o = e.data && e.data._attachments ? Object.keys(e.data._attachments) : [];
                        if (!o.length) return t();
                        var r = 0;
                        for (var i in e.data._attachments) a(e.data._attachments[i], n)
                    })
                }

                function s(e, t) {
                    function n(e) {
                        i || (e ? (i = e, PouchUtils.call(t, i)) : a === u.length && r())
                    }

                    function o(e) {
                        a++, n(e)
                    }

                    function r() {
                        e.data._doc_id_rev = e.data._id + "::" + e.data._rev;
                        var n = m.objectStore(BY_SEQ_STORE).put(e.data);
                        n.onsuccess = function (n) {
                            Pouch.DEBUG && console.log(name + ": Wrote Document ", e.metadata.id), e.metadata.seq =
                                n.target.result, delete e.metadata.rev;
                            var o = m.objectStore(DOC_STORE).put(e.metadata);
                            o.onsuccess = function () {
                                g.push(e), PouchUtils.call(t)
                            }
                        }
                    }
                    var i = null,
                        a = 0;
                    e.data._id = e.metadata.id, e.data._rev = e.metadata.rev, y++, PouchUtils.isDeleted(e.metadata,
                        e.metadata.rev) && (e.data._deleted = !0);
                    var u = e.data._attachments ? Object.keys(e.data._attachments) : [];
                    for (var s in e.data._attachments)
                        if (e.data._attachments[s].stub) a++, n();
                        else {
                            var c = e.data._attachments[s].data;
                            delete e.data._attachments[s].data;
                            var l = e.data._attachments[s].digest;
                            f(e, l, c, o)
                        }
                    u.length || r()
                }

                function c(e, t) {
                    var n = PouchMerge.merge(e.rev_tree, t.metadata.rev_tree[0], 1e3),
                        o = PouchUtils.isDeleted(e),
                        i = o && PouchUtils.isDeleted(t.metadata) || !o && h && "new_leaf" !== n.conflicts;
                    return i ? (g.push(d(Pouch.Errors.REV_CONFLICT, t._bulk_seq)), r()) : (t.metadata.rev_tree = n.tree,
                        s(t, r), void 0)
                }

                function l(e) {
                    return "was_delete" in t && PouchUtils.isDeleted(e.metadata) ? (g.push(Pouch.Errors.MISSING_DOC),
                        r()) : (s(e, r), void 0)
                }

                function d(e, t) {
                    return e._bulk_seq = t, e
                }

                function f(e, t, n, o) {
                    var r = m.objectStore(ATTACH_STORE);
                    r.get(t).onsuccess = function (i) {
                        var a = i.target.result && i.target.result.refs || {}, u = [e.metadata.id, e.metadata.rev].join(
                                "@"),
                            s = {
                                digest: t,
                                body: n,
                                refs: a
                            };
                        s.refs[u] = !0, r.put(s).onsuccess = function () {
                            PouchUtils.call(o)
                        }
                    }
                }
                var h = t.new_edits,
                    p = e.docs,
                    v = p.map(function (e, t) {
                        var n = PouchUtils.parseDoc(e, h);
                        return n._bulk_seq = t, n
                    }),
                    _ = v.filter(function (e) {
                        return e.error
                    });
                if (_.length) return PouchUtils.call(n, _[0]);
                var m, g = [],
                    y = 0;
                u(function () {
                    m = idb.transaction([DOC_STORE, BY_SEQ_STORE, ATTACH_STORE, META_STORE], "readwrite"), m.onerror =
                        idbError(n), m.ontimeout = idbError(n), m.oncomplete = i, r()
                })
            }, api._get = function idb_get(e, t, n) {
                function o() {
                    PouchUtils.call(n, a, {
                        doc: r,
                        metadata: i,
                        ctx: u
                    })
                }
                var r, i, a, u;
                u = t.ctx ? t.ctx : idb.transaction([DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], "readonly"), u.objectStore(
                    DOC_STORE).get(e).onsuccess = function (e) {
                        if (i = e.target.result, !i) return a = Pouch.Errors.MISSING_DOC, o();
                        if (PouchUtils.isDeleted(i) && !t.rev) return a = Pouch.error(Pouch.Errors.MISSING_DOC,
                            "deleted"), o();
                        var n = PouchMerge.winningRev(i),
                            s = i.id + "::" + (t.rev ? t.rev : n),
                            c = u.objectStore(BY_SEQ_STORE).index("_doc_id_rev");
                        c.get(s).onsuccess = function (e) {
                            return r = e.target.result, r && r._doc_id_rev && delete r._doc_id_rev, r ? (o(), void 0) :
                                (a = Pouch.Errors.MISSING_DOC, o())
                        }
                    }
            }, api._getAttachment = function (e, t, n) {
                var o, r;
                r = t.ctx ? t.ctx : idb.transaction([DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], "readonly");
                var i = e.digest,
                    a = e.content_type;
                r.objectStore(ATTACH_STORE).get(i).onsuccess = function (e) {
                    var r = e.target.result.body;
                    if (t.encode)
                        if (blobSupport) {
                            var i = new FileReader;
                            i.onloadend = function () {
                                o = btoa(this.result), PouchUtils.call(n, null, o)
                            }, i.readAsBinaryString(r)
                        } else o = r, PouchUtils.call(n, null, o);
                    else blobSupport ? o = r : (r = fixBinary(atob(r)), o = new Blob([r], {
                        type: a
                    })), PouchUtils.call(n, null, o)
                }
            }, api._allDocs = function idb_allDocs(e, t) {
                var n = "startkey" in e ? e.startkey : !1,
                    o = "endkey" in e ? e.endkey : !1,
                    r = "descending" in e ? e.descending : !1;
                r = r ? "prev" : null;
                var i = n && o ? window.IDBKeyRange.bound(n, o) : n ? window.IDBKeyRange.lowerBound(n) : o ? window
                    .IDBKeyRange.upperBound(o) : null,
                    a = idb.transaction([DOC_STORE, BY_SEQ_STORE], "readonly");
                a.oncomplete = function () {
                    "keys" in e && (e.keys.forEach(function (e) {
                        e in l ? c.push(l[e]) : c.push({
                            key: e,
                            error: "not_found"
                        })
                    }), e.descending && c.reverse()), PouchUtils.call(t, null, {
                        total_rows: c.length,
                        rows: "limit" in e ? c.slice(0, e.limit) : c
                    })
                };
                var u = a.objectStore(DOC_STORE),
                    s = r ? u.openCursor(i, r) : u.openCursor(i),
                    c = [],
                    l = {};
                s.onsuccess = function (t) {
                    function n(t, n) {
                        if (PouchUtils.isLocalId(t.id)) return o["continue"]();
                        var r = {
                            id: t.id,
                            key: t.id,
                            value: {
                                rev: PouchMerge.winningRev(t)
                            }
                        };
                        if (e.include_docs) {
                            r.doc = n, r.doc._rev = PouchMerge.winningRev(t), r.doc._doc_id_rev && delete r.doc._doc_id_rev,
                                e.conflicts && (r.doc._conflicts = PouchMerge.collectConflicts(t));
                            for (var i in r.doc._attachments) r.doc._attachments[i].stub = !0
                        }
                        "keys" in e ? e.keys.indexOf(t.id) > -1 && (PouchUtils.isDeleted(t) && (r.value.deleted = !
                            0, r.doc = null), l[r.id] = r) : PouchUtils.isDeleted(t) || c.push(r), o["continue"]()
                    }
                    if (t.target.result) {
                        var o = t.target.result,
                            r = o.value;
                        if (e.include_docs) {
                            var i = a.objectStore(BY_SEQ_STORE).index("_doc_id_rev"),
                                u = PouchMerge.winningRev(r),
                                s = r.id + "::" + u;
                            i.get(s).onsuccess = function (e) {
                                n(o.value, e.target.result)
                            }
                        } else n(r)
                    }
                }
            }, api._info = function idb_info(e) {
                function t(e) {
                    r = e.target.result && e.target.result.updateSeq || 0
                }

                function n(e) {
                    var n = e.target.result;
                    return n ? (n.value.deleted !== !0 && o++, n["continue"](), void 0) : (i.objectStore(META_STORE)
                        .get(META_STORE).onsuccess = t, void 0)
                }
                var o = 0,
                    r = 0,
                    i = idb.transaction([DOC_STORE, META_STORE], "readonly");
                i.oncomplete = function () {
                    e(null, {
                        db_name: name,
                        doc_count: o,
                        update_seq: r
                    })
                }, i.objectStore(DOC_STORE).openCursor().onsuccess = n
            }, api._changes = function idb_changes(opts) {
                function fetchChanges() {
                    txn = idb.transaction([DOC_STORE, BY_SEQ_STORE]), txn.oncomplete = onTxnComplete;
                    var e;
                    e = descending ? txn.objectStore(BY_SEQ_STORE).openCursor(window.IDBKeyRange.lowerBound(opts.since, !
                        0), descending) : txn.objectStore(BY_SEQ_STORE).openCursor(window.IDBKeyRange.lowerBound(
                        opts.since, !0)), e.onsuccess = onsuccess, e.onerror = onerror
                }

                function onsuccess(e) {
                    if (!e.target.result) {
                        for (var t = 0, n = results.length; n > t; t++) {
                            var o = results[t];
                            o && dedupResults.push(o)
                        }
                        return !1
                    }
                    var r = e.target.result,
                        i = r.value._id,
                        a = resultIndices[i];
                    if (void 0 !== a) return results[a].seq = r.key, results.push(results[a]), results[a] = null,
                        resultIndices[i] = results.length - 1, r["continue"]();
                    var u = txn.objectStore(DOC_STORE);
                    u.get(r.value._id).onsuccess = function (e) {
                        var t = e.target.result;
                        if (PouchUtils.isLocalId(t.id)) return r["continue"]();
                        t.seq > last_seq && (last_seq = t.seq);
                        var n = PouchMerge.winningRev(t),
                            o = t.id + "::" + n,
                            i = txn.objectStore(BY_SEQ_STORE).index("_doc_id_rev");
                        i.get(o).onsuccess = function (e) {
                            var o = e.target.result;
                            delete o._doc_id_rev;
                            var i = [{
                                rev: n
                            }];
                            "all_docs" === opts.style && (i = PouchMerge.collectLeaves(t.rev_tree).map(function (e) {
                                return {
                                    rev: e.rev
                                }
                            }));
                            var a = {
                                id: t.id,
                                seq: r.key,
                                changes: i,
                                doc: o
                            };
                            PouchUtils.isDeleted(t, n) && (a.deleted = !0), opts.conflicts && (a.doc._conflicts =
                                PouchMerge.collectConflicts(t));
                            var u = a.id,
                                s = resultIndices[u];
                            void 0 !== s && (results[s] = null), results.push(a), resultIndices[u] = results.length -
                                1, r["continue"]()
                        }
                    }
                }

                function onTxnComplete() {
                    PouchUtils.processChanges(opts, dedupResults, last_seq)
                }

                function onerror() {
                    PouchUtils.call(opts.complete)
                }
                if (Pouch.DEBUG && console.log(name + ": Start Changes Feed: continuous=" + opts.continuous), opts.continuous) {
                    var id = name + ":" + Pouch.uuid();
                    return opts.cancelled = !1, IdbPouch.Changes.addListener(name, id, api, opts), IdbPouch.Changes
                        .notify(name), {
                            cancel: function () {
                                Pouch.DEBUG && console.log(name + ": Cancel Changes Feed"), opts.cancelled = !0,
                                    IdbPouch.Changes.removeListener(name, id)
                            }
                        }
                }
                var descending = opts.descending ? "prev" : null,
                    last_seq = 0;
                opts.since = opts.since && !descending ? opts.since : 0;
                var results = [],
                    resultIndices = {}, dedupResults = [],
                    txn;
                if (opts.filter && "string" == typeof opts.filter) {
                    var filterName = opts.filter.split("/");
                    api.get("_design/" + filterName[0], function (err, ddoc) {
                        var filter = eval("(function() { return " + ddoc.filters[filterName[1]] + " })()");
                        opts.filter = filter, fetchChanges()
                    })
                } else fetchChanges()
            }, api._close = function (e) {
                return null === idb ? PouchUtils.call(e, Pouch.Errors.NOT_OPEN) : (idb.close(), PouchUtils.call(e,
                    null), void 0)
            }, api._getRevisionTree = function (e, t) {
                var n = idb.transaction([DOC_STORE], "readonly"),
                    o = n.objectStore(DOC_STORE).get(e);
                o.onsuccess = function (e) {
                    var n = e.target.result;
                    n ? PouchUtils.call(t, null, n.rev_tree) : PouchUtils.call(t, Pouch.Errors.MISSING_DOC)
                }
            }, api._doCompaction = function (e, t, n, o) {
                var r = idb.transaction([DOC_STORE, BY_SEQ_STORE], "readwrite"),
                    i = r.objectStore(DOC_STORE);
                i.get(e).onsuccess = function (o) {
                    var i = o.target.result;
                    i.rev_tree = t;
                    var a = n.length;
                    n.forEach(function (t) {
                        var n = r.objectStore(BY_SEQ_STORE).index("_doc_id_rev"),
                            o = e + "::" + t;
                        n.getKey(o).onsuccess = function (e) {
                            var t = e.target.result;
                            t && (r.objectStore(BY_SEQ_STORE)["delete"](t), a--, a || r.objectStore(DOC_STORE).put(
                                i))
                        }
                    })
                }, r.oncomplete = function () {
                    PouchUtils.call(o)
                }
            }, api
    };
    IdbPouch.valid = function idb_valid() {
        return !!window.indexedDB
    }, IdbPouch.destroy = function idb_destroy(e, t) {
        Pouch.DEBUG && console.log(e + ": Delete Database"), IdbPouch.Changes.clearListeners(e), Pouch.openReqList[
            e] && Pouch.openReqList[e].result && Pouch.openReqList[e].result.close();
        var n = window.indexedDB.deleteDatabase(e);
        n.onsuccess = function () {
            Pouch.openReqList[e] && (Pouch.openReqList[e] = null), PouchUtils.call(t, null)
        }, n.onerror = idbError(t)
    }, IdbPouch.Changes = new PouchUtils.Changes, Pouch.adapter("idb", IdbPouch);
    var POUCH_VERSION = 1,
        POUCH_SIZE = 5242880,
        DOC_STORE = quote("document-store"),
        BY_SEQ_STORE = quote("by-sequence"),
        ATTACH_STORE = quote("attach-store"),
        META_STORE = quote("metadata-store"),
        unknownError = function (e) {
            return function (t) {
                PouchUtils.call(e, {
                    status: 500,
                    error: t.type,
                    reason: t.target
                })
            }
        }, webSqlPouch = function (opts, callback) {
            function dbCreated() {
                callback(null, api)
            }

            function setup() {
                db.transaction(function (e) {
                    var t = "CREATE TABLE IF NOT EXISTS " + META_STORE + " (update_seq, dbid)",
                        n = "CREATE TABLE IF NOT EXISTS " + ATTACH_STORE + " (digest, json, body BLOB)",
                        o = "CREATE TABLE IF NOT EXISTS " + DOC_STORE + " (id unique, seq, json, winningseq)",
                        r = "CREATE TABLE IF NOT EXISTS " + BY_SEQ_STORE +
                            " (seq INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, doc_id_rev UNIQUE, json)";
                    e.executeSql(n), e.executeSql(o), e.executeSql(r), e.executeSql(t);
                    var i = "SELECT update_seq FROM " + META_STORE;
                    e.executeSql(i, [], function (e, t) {
                        if (!t.rows.length) {
                            var n = "INSERT INTO " + META_STORE + " (update_seq) VALUES (?)";
                            return e.executeSql(n, [0]), void 0
                        }
                    });
                    var a = "SELECT dbid FROM " + META_STORE + " WHERE dbid IS NOT NULL";
                    e.executeSql(a, [], function (e, t) {
                        if (!t.rows.length) {
                            var n = "UPDATE " + META_STORE + " SET dbid=?";
                            return instanceId = Pouch.uuid(), e.executeSql(n, [instanceId]), void 0
                        }
                        instanceId = t.rows.item(0).dbid
                    })
                }, unknownError(callback), dbCreated)
            }

            function makeRevs(e) {
                return e.map(function (e) {
                    return {
                        rev: e.rev
                    }
                })
            }
            var api = {}, instanceId = null,
                name = opts.name,
                db = openDatabase(name, POUCH_VERSION, name, POUCH_SIZE);
            return db ? (PouchUtils.isCordova() ? window.addEventListener(name + "_pouch", setup, !1) : setup(),
                api.type = function () {
                    return "websql"
                }, api.id = function () {
                    return instanceId
                }, api._info = function (e) {
                    db.transaction(function (t) {
                        var n = "SELECT COUNT(id) AS count FROM " + DOC_STORE;
                        t.executeSql(n, [], function (t, n) {
                            var o = n.rows.item(0).count,
                                r = "SELECT update_seq FROM " + META_STORE;
                            t.executeSql(r, [], function (t, n) {
                                var r = n.rows.item(0).update_seq;
                                e(null, {
                                    db_name: name,
                                    doc_count: o,
                                    update_seq: r
                                })
                            })
                        })
                    })
                }, api._bulkDocs = function idb_bulkDocs(e, t, n) {
                    function o(e, t) {
                        return e._bulk_seq - t._bulk_seq
                    }

                    function r() {
                        var e = [];
                        E.sort(o), E.forEach(function (t) {
                            if (delete t._bulk_seq, t.error) return e.push(t), void 0;
                            var n = t.metadata,
                                o = PouchMerge.winningRev(n);
                            e.push({
                                ok: !0,
                                id: n.id,
                                rev: o
                            }), PouchUtils.isLocalId(n.id) || (_++, webSqlPouch.Changes.notify(name),
                                webSqlPouch.Changes.notifyLocalWindows(name))
                        });
                        var t = "SELECT update_seq FROM " + META_STORE;
                        y.executeSql(t, [], function (t, o) {
                            var r = o.rows.item(0).update_seq + _,
                                i = "UPDATE " + META_STORE + " SET update_seq=?";
                            t.executeSql(i, [r], function () {
                                PouchUtils.call(n, null, e)
                            })
                        })
                    }

                    function i(e, t) {
                        if (e.stub) return t();
                        if ("string" == typeof e.data) {
                            try {
                                e.data = atob(e.data)
                            } catch (o) {
                                var r = Pouch.error(Pouch.Errors.BAD_ARG, "Attachments need to be base64 encoded");
                                return PouchUtils.call(n, r)
                            }
                            return e.digest = "md5-" + PouchUtils.Crypto.MD5(e.data), t()
                        }
                        var i = new FileReader;
                        i.onloadend = function () {
                            e.data = this.result, e.digest = "md5-" + PouchUtils.Crypto.MD5(this.result), t()
                        }, i.readAsBinaryString(e.data)
                    }

                    function a(e) {
                        function t() {
                            n++, m.length === n && e()
                        }
                        if (!m.length) return e();
                        var n = 0,
                            o = 0;
                        m.forEach(function (e) {
                            function n() {
                                o++, o === r.length && t()
                            }
                            var r = e.data && e.data._attachments ? Object.keys(e.data._attachments) : [];
                            if (!r.length) return t();
                            for (var a in e.data._attachments) i(e.data._attachments[a], n)
                        })
                    }

                    function u(e, t, n) {
                        function o() {
                            var t = e.data,
                                n = "INSERT INTO " + BY_SEQ_STORE + " (doc_id_rev, json) VALUES (?, ?);";
                            y.executeSql(n, [t._id + "::" + t._rev, JSON.stringify(t)], a)
                        }

                        function r(e) {
                            u || (e ? (u = e, PouchUtils.call(t, u)) : s === c.length && o())
                        }

                        function i(e) {
                            s++, r(e)
                        }

                        function a(o, r) {
                            var i = e.metadata.seq = r.insertId;
                            delete e.metadata.rev;
                            var a = PouchMerge.winningRev(e.metadata),
                                u = n ? "UPDATE " + DOC_STORE + " SET seq=?, json=?, winningseq=(SELECT seq FROM " +
                                    BY_SEQ_STORE + " WHERE doc_id_rev=?) WHERE id=?" : "INSERT INTO " + DOC_STORE +
                                    " (id, seq, winningseq, json) VALUES (?, ?, ?, ?);",
                                s = JSON.stringify(e.metadata),
                                c = e.metadata.id + "::" + a,
                                l = n ? [i, s, c, e.metadata.id] : [e.metadata.id, i, i, s];
                            o.executeSql(u, l, function () {
                                E.push(e), PouchUtils.call(t, null)
                            })
                        }
                        var u = null,
                            s = 0;
                        e.data._id = e.metadata.id, e.data._rev = e.metadata.rev, PouchUtils.isDeleted(e.metadata,
                            e.metadata.rev) && (e.data._deleted = !0);
                        var c = e.data._attachments ? Object.keys(e.data._attachments) : [];
                        for (var l in e.data._attachments)
                            if (e.data._attachments[l].stub) s++, r();
                            else {
                                var d = e.data._attachments[l].data;
                                delete e.data._attachments[l].data;
                                var h = e.data._attachments[l].digest;
                                f(e, h, d, i)
                            }
                        c.length || o()
                    }

                    function s(e, t) {
                        var n = PouchMerge.merge(e.rev_tree, t.metadata.rev_tree[0], 1e3),
                            o = PouchUtils.isDeleted(e) && PouchUtils.isDeleted(t.metadata) || !PouchUtils.isDeleted(
                                e) && p && "new_leaf" !== n.conflicts;
                        return o ? (E.push(d(Pouch.Errors.REV_CONFLICT, t._bulk_seq)), l()) : (t.metadata.rev_tree =
                            n.tree, u(t, l, !0), void 0)
                    }

                    function c(e) {
                        return "was_delete" in t && PouchUtils.isDeleted(e.metadata) ? (E.push(Pouch.Errors.MISSING_DOC),
                            l()) : (u(e, l, !1), void 0)
                    }

                    function l() {
                        if (!m.length) return r();
                        var e = m.shift(),
                            t = e.metadata.id;
                        t in P ? s(P[t], e) : (P[t] = e.metadata, c(e))
                    }

                    function d(e, t) {
                        return e._bulk_seq = t, e
                    }

                    function f(e, t, n, o) {
                        var r = [e.metadata.id, e.metadata.rev].join("@"),
                            i = {
                                digest: t
                            }, a = "SELECT digest, json FROM " + ATTACH_STORE + " WHERE digest=?";
                        y.executeSql(a, [t], function (e, u) {
                            u.rows.length ? (i.refs = JSON.parse(u.rows.item(0).json).refs, a = "UPDATE " +
                                ATTACH_STORE + " SET json=?, body=? WHERE digest=?", e.executeSql(a, [JSON.stringify(
                                    i), n, t], function () {
                                        PouchUtils.call(o, null)
                                    })) : (i.refs = {}, i.refs[r] = !0, a = "INSERT INTO " + ATTACH_STORE +
                                "(digest, json, body) VALUES (?, ?, ?)", e.executeSql(a, [t, JSON.stringify(i),
                                    n
                                ], function () {
                                    PouchUtils.call(o, null)
                                }))
                        })
                    }

                    function h(e, t) {
                        for (var n = 0; t.rows.length > n; n++) {
                            var o = t.rows.item(n);
                            P[o.id] = JSON.parse(o.json)
                        }
                        l()
                    }
                    var p = t.new_edits,
                        v = e.docs,
                        _ = 0,
                        m = v.map(function (e, t) {
                            var n = PouchUtils.parseDoc(e, p);
                            return n._bulk_seq = t, n
                        }),
                        g = m.filter(function (e) {
                            return e.error
                        });
                    if (g.length) return PouchUtils.call(n, g[0]);
                    var y, E = [],
                        P = {};
                    a(function () {
                        db.transaction(function (e) {
                            y = e;
                            var t = "(" + m.map(function (e) {
                                return quote(e.metadata.id)
                            }).join(",") + ")",
                                n = "SELECT * FROM " + DOC_STORE + " WHERE id IN " + t;
                            y.executeSql(n, [], h)
                        }, unknownError(n))
                    })
                }, api._get = function (e, t, n) {
                    function o() {
                        PouchUtils.call(n, a, {
                            doc: r,
                            metadata: i,
                            ctx: u
                        })
                    }
                    var r, i, a;
                    if (!t.ctx) return db.transaction(function (o) {
                        t.ctx = o, api._get(e, t, n)
                    }), void 0;
                    var u = t.ctx,
                        s = "SELECT * FROM " + DOC_STORE + " WHERE id=?";
                    u.executeSql(s, [e], function (e, n) {
                        if (!n.rows.length) return a = Pouch.Errors.MISSING_DOC, o();
                        if (i = JSON.parse(n.rows.item(0).json), PouchUtils.isDeleted(i) && !t.rev) return a =
                            Pouch.error(Pouch.Errors.MISSING_DOC, "deleted"), o();
                        var s = PouchMerge.winningRev(i),
                            c = t.rev ? t.rev : s;
                        c = i.id + "::" + c;
                        var l = "SELECT * FROM " + BY_SEQ_STORE + " WHERE doc_id_rev=?";
                        u.executeSql(l, [c], function (e, t) {
                            return t.rows.length ? (r = JSON.parse(t.rows.item(0).json), o(), void 0) : (a =
                                Pouch.Errors.MISSING_DOC, o())
                        })
                    })
                }, api._allDocs = function (e, t) {
                    var n = [],
                        o = {}, r = "startkey" in e ? e.startkey : !1,
                        i = "endkey" in e ? e.endkey : !1,
                        a = "descending" in e ? e.descending : !1,
                        u = "SELECT " + DOC_STORE + ".id, " + BY_SEQ_STORE + ".seq, " + BY_SEQ_STORE +
                            ".json AS data, " + DOC_STORE + ".json AS metadata FROM " + BY_SEQ_STORE + " JOIN " +
                            DOC_STORE + " ON " + BY_SEQ_STORE + ".seq = " + DOC_STORE + ".winningseq";
                    "keys" in e ? u += " WHERE " + DOC_STORE + ".id IN (" + e.keys.map(function (e) {
                        return quote(e)
                    }).join(",") + ")" : (r && (u += " WHERE " + DOC_STORE + '.id >= "' + r + '"'), i && (u += (r ?
                            " AND " : " WHERE ") + DOC_STORE + '.id <= "' + i + '"'), u += " ORDER BY " + DOC_STORE +
                        ".id " + (a ? "DESC" : "ASC")), db.transaction(function (t) {
                            t.executeSql(u, [], function (t, r) {
                                for (var i = 0, a = r.rows.length; a > i; i++) {
                                    var u = r.rows.item(i),
                                        s = JSON.parse(u.metadata),
                                        c = JSON.parse(u.data);
                                    if (!PouchUtils.isLocalId(s.id)) {
                                        if (u = {
                                            id: s.id,
                                            key: s.id,
                                            value: {
                                            rev: PouchMerge.winningRev(s)
                                        }
                                        }, e.include_docs) {
                                            u.doc = c, u.doc._rev = PouchMerge.winningRev(s), e.conflicts && (u
                                                .doc._conflicts = PouchMerge.collectConflicts(s));
                                            for (var l in u.doc._attachments) u.doc._attachments[l].stub = !0
                                        }
                                        "keys" in e ? e.keys.indexOf(s.id) > -1 && (PouchUtils.isDeleted(s) &&
                                            (u.value.deleted = !0, u.doc = null), o[u.id] = u) : PouchUtils.isDeleted(
                                            s) || n.push(u)
                                    }
                                }
                            })
                        }, unknownError(t), function () {
                            "keys" in e && (e.keys.forEach(function (e) {
                                e in o ? n.push(o[e]) : n.push({
                                    key: e,
                                    error: "not_found"
                                })
                            }), e.descending && n.reverse()), PouchUtils.call(t, null, {
                                total_rows: n.length,
                                rows: "limit" in e ? n.slice(0, e.limit) : n
                            })
                        })
                }, api._changes = function idb_changes(opts) {
                    function fetchChanges() {
                        var e = "SELECT " + DOC_STORE + ".id, " + BY_SEQ_STORE + ".seq, " + BY_SEQ_STORE +
                            ".json AS data, " + DOC_STORE + ".json AS metadata FROM " + BY_SEQ_STORE + " JOIN " +
                            DOC_STORE + " ON " + BY_SEQ_STORE + ".seq = " + DOC_STORE + ".winningseq WHERE " +
                            DOC_STORE + ".seq > " + opts.since + " ORDER BY " + DOC_STORE + ".seq " + (descending ?
                                "DESC" : "ASC");
                        db.transaction(function (t) {
                            t.executeSql(e, [], function (e, t) {
                                for (var n = 0, o = 0, r = t.rows.length; r > o; o++) {
                                    var i = t.rows.item(o),
                                        a = JSON.parse(i.metadata);
                                    if (!PouchUtils.isLocalId(a.id)) {
                                        i.seq > n && (n = i.seq);
                                        var u = JSON.parse(i.data),
                                            s = u._rev,
                                            c = [{
                                                rev: s
                                            }];
                                        "all_docs" === opts.style && (c = makeRevs(PouchMerge.collectLeaves(
                                            a.rev_tree)));
                                        var l = {
                                            id: a.id,
                                            seq: i.seq,
                                            changes: c,
                                            doc: u
                                        };
                                        PouchUtils.isDeleted(a, s) && (l.deleted = !0), opts.conflicts && (
                                            l.doc._conflicts = PouchMerge.collectConflicts(a)), results.push(
                                            l)
                                    }
                                }
                                PouchUtils.processChanges(opts, results, n)
                            })
                        })
                    }
                    if (Pouch.DEBUG && console.log(name + ": Start Changes Feed: continuous=" + opts.continuous),
                        opts.continuous) {
                        var id = name + ":" + Pouch.uuid();
                        return opts.cancelled = !1, webSqlPouch.Changes.addListener(name, id, api, opts),
                            webSqlPouch.Changes.notify(name), {
                                cancel: function () {
                                    Pouch.DEBUG && console.log(name + ": Cancel Changes Feed"), opts.cancelled = !0,
                                        webSqlPouch.Changes.removeListener(name, id)
                                }
                            }
                    }
                    var descending = opts.descending;
                    opts.since = opts.since && !descending ? opts.since : 0;
                    var results = [],
                        txn;
                    if (opts.filter && "string" == typeof opts.filter) {
                        var filterName = opts.filter.split("/");
                        api.get("_design/" + filterName[0], function (err, ddoc) {
                            var filter = eval("(function() { return " + ddoc.filters[filterName[1]] + " })()");
                            opts.filter = filter, fetchChanges()
                        })
                    } else fetchChanges()
                }, api._close = function (e) {
                    PouchUtils.call(e, null)
                }, api._getAttachment = function (e, t, n) {
                    var o, r = t.ctx,
                        i = e.digest,
                        a = e.content_type,
                        u = "SELECT body FROM " + ATTACH_STORE + " WHERE digest=?";
                    r.executeSql(u, [i], function (e, r) {
                        var i = r.rows.item(0).body;
                        o = t.encode ? btoa(i) : new Blob([i], {
                            type: a
                        }), PouchUtils.call(n, null, o)
                    })
                }, api._getRevisionTree = function (e, t) {
                    db.transaction(function (n) {
                        var o = "SELECT json AS metadata FROM " + DOC_STORE + " WHERE id = ?";
                        n.executeSql(o, [e], function (e, n) {
                            if (n.rows.length) {
                                var o = JSON.parse(n.rows.item(0).metadata);
                                PouchUtils.call(t, null, o.rev_tree)
                            } else PouchUtils.call(t, Pouch.Errors.MISSING_DOC)
                        })
                    })
                }, api._doCompaction = function (e, t, n, o) {
                    db.transaction(function (r) {
                        var i = "SELECT json AS metadata FROM " + DOC_STORE + " WHERE id = ?";
                        r.executeSql(i, [e], function (r, i) {
                            if (!i.rows.length) return PouchUtils.call(o);
                            var a = JSON.parse(i.rows.item(0).metadata);
                            a.rev_tree = t;
                            var u = "DELETE FROM " + BY_SEQ_STORE + " WHERE doc_id_rev IN (" + n.map(
                                function (t) {
                                    return quote(e + "::" + t)
                                }).join(",") + ")";
                            r.executeSql(u, [], function (t) {
                                var n = "UPDATE " + DOC_STORE + " SET json = ? WHERE id = ?";
                                t.executeSql(n, [JSON.stringify(a), e], function () {
                                    o()
                                })
                            })
                        })
                    })
                }, api) : PouchUtils.call(callback, Pouch.Errors.UNKNOWN_ERROR)
        };
    webSqlPouch.valid = function () {
        return !!window.openDatabase
    }, webSqlPouch.destroy = function (e, t) {
        var n = openDatabase(e, POUCH_VERSION, e, POUCH_SIZE);
        n.transaction(function (e) {
            e.executeSql("DROP TABLE IF EXISTS " + DOC_STORE, []), e.executeSql("DROP TABLE IF EXISTS " +
                BY_SEQ_STORE, []), e.executeSql("DROP TABLE IF EXISTS " + ATTACH_STORE, []), e.executeSql(
                "DROP TABLE IF EXISTS " + META_STORE, [])
        }, unknownError(t), function () {
            PouchUtils.call(t, null)
        })
    }, webSqlPouch.Changes = new PouchUtils.Changes, Pouch.adapter("websql", webSqlPouch);
    var pouchCollate;
    "undefined" != typeof module && module.exports && (pouchCollate = require("../pouch.collate.js"));
    var MapReduce = function (db) {
        function viewQuery(fun, options) {
            function sum(e) {
                return e.reduce(function (e, t) {
                    return e + t
                }, 0)
            }
            if (options.complete) {
                fun.reduce || (options.reduce = !1);
                var builtInReduce = {
                    _sum: function (e, t) {
                        return sum(t)
                    },
                    _count: function (e, t, n) {
                        return n ? sum(t) : t.length
                    },
                    _stats: function (e, t) {
                        return {
                            sum: sum(t),
                            min: Math.min.apply(null, t),
                            max: Math.max.apply(null, t),
                            count: t.length,
                            sumsqr: function () {
                                var e = 0;
                                for (var n in t) "number" == typeof t[n] && (e += t[n] * t[n]);
                                return e
                            }()
                        }
                    }
                }, results = [],
                    current = null,
                    num_started = 0,
                    completed = !1,
                    emit = function (e, t) {
                        var n = {
                            id: current.doc._id,
                            key: e,
                            value: t
                        };
                        if (!(options.startkey && 0 > pouchCollate(e, options.startkey) || options.endkey &&
                            pouchCollate(e, options.endkey) > 0 || options.key && 0 !== pouchCollate(e, options
                                .key))) {
                            if (num_started++, options.include_docs) {
                                if (t && "object" == typeof t && t._id) return db.get(t._id, function (e, t) {
                                    t && (n.doc = t), results.push(n), checkComplete()
                                }), void 0;
                                n.doc = current.doc
                            }
                            results.push(n)
                        }
                    };
                eval("fun.map = " + ("" + fun.map) + ";"), fun.reduce && (builtInReduce[fun.reduce] && (fun.reduce =
                    builtInReduce[fun.reduce]), eval("fun.reduce = " + ("" + fun.reduce) + ";"));
                var checkComplete = function () {
                    if (completed && results.length == num_started) {
                        if (results.sort(function (e, t) {
                            return pouchCollate(e.key, t.key)
                        }), options.descending && results.reverse(), options.reduce === !1) return options.complete(
                            null, {
                                rows: "limit" in options ? results.slice(0, options.limit) : results,
                                total_rows: results.length
                            });
                        var e = [];
                        results.forEach(function (t) {
                            var n = e[e.length - 1] || null;
                            return n && 0 === pouchCollate(n.key[0][0], t.key) ? (n.key.push([t.key, t.id]), n.value
                                .push(t.value), void 0) : (e.push({
                                    key: [
                                        [t.key, t.id]
                                    ],
                                    value: [t.value]
                                }), void 0)
                        }), e.forEach(function (e) {
                            e.value = fun.reduce(e.key, e.value) || null, e.key = e.key[0][0]
                        }), options.complete(null, {
                            rows: "limit" in options ? e.slice(0, options.limit) : e,
                            total_rows: e.length
                        })
                    }
                };
                db.changes({
                    conflicts: !0,
                    include_docs: !0,
                    onChange: function (e) {
                        "deleted" in e || (current = {
                            doc: e.doc
                        }, fun.map.call(this, e.doc))
                    },
                    complete: function () {
                        completed = !0, checkComplete()
                    }
                })
            }
        }

        function httpQuery(e, t, n) {
            var o = [],
                r = void 0,
                i = "GET";
            if (t.reduce !== void 0 && o.push("reduce=" + t.reduce), t.include_docs !== void 0 && o.push(
                    "include_docs=" + t.include_docs), t.limit !== void 0 && o.push("limit=" + t.limit), t.descending !==
                void 0 && o.push("descending=" + t.descending), t.startkey !== void 0 && o.push("startkey=" +
                    encodeURIComponent(JSON.stringify(t.startkey))), t.endkey !== void 0 && o.push("endkey=" +
                    encodeURIComponent(JSON.stringify(t.endkey))), t.key !== void 0 && o.push("key=" +
                    encodeURIComponent(JSON.stringify(t.key))), t.group !== void 0 && o.push("group=" + t.group), t
                .group_level !== void 0 && o.push("group_level=" + t.group_level), t.keys !== void 0 && (i = "POST",
                    r = JSON.stringify({
                keys: t.keys
            })), o = o.join("&"), o = "" === o ? "" : "?" + o, "string" == typeof e) {
                var a = e.split("/");
                return db.request({
                    method: i,
                    url: "_design/" + a[0] + "/_view/" + a[1] + o,
                    body: r
                }, n), void 0
            }
            var u = JSON.parse(JSON.stringify(e, function (e, t) {
                return "function" == typeof t ? t + "" : t
            }));
            db.request({
                method: "POST",
                url: "_temp_view" + o,
                body: u
            }, n)
        }

        function query(e, t, n) {
            if ("function" == typeof t && (n = t, t = {}), n && (t.complete = n), "http" === db.type()) return "function" ==
                typeof e ? httpQuery({
                    map: e
                }, t, n) : httpQuery(e, t, n);
            if ("object" == typeof e) return viewQuery(e, t);
            if ("function" == typeof e) return viewQuery({
                map: e
            }, t);
            var o = e.split("/");
            db.get("_design/" + o[0], function (e, r) {
                return e ? (n && n(e), void 0) : r.views[o[1]] ? (viewQuery({
                    map: r.views[o[1]].map,
                    reduce: r.views[o[1]].reduce
                }, t), void 0) : (n && n({
                    error: "not_found",
                    reason: "missing_named_view"
                }), void 0)
            })
        }
        return {
            query: query
        }
    };
    MapReduce._delete = function () { }, Pouch.plugin("mapreduce", MapReduce)
})(this);
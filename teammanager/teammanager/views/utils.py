import ast

from teammanager.views.models import View

def compute_expr(expr, person):
    if isinstance(expr, ast.Name):
        if expr.id.startswith('V'):
            view = View.objects.get(id=expr.id[1:])
            val = view.value(pid=person.id)
            if val is None:
                return 0
            return val
        raise SyntaxError("Unknown name: %s" % expr.id)
    if isinstance(expr, ast.Attribute):
        if not isinstance(expr.value, ast.Name):
            raise SyntaxError("Unknown attribute value: %s" % expr.value)
        if expr.value.id is not "P":
            raise SyntaxError("Unknown attribute value: %s" % expr.value.id)
        if expr.attr is "height":
            return 183
            return person.height
        raise SyntaxError("Unknown attribute: %s" % expr.value.attr)
    if isinstance(expr, ast.Num):
        return expr.n
    if isinstance(expr, ast.BinOp):
        left = compute_expr(expr.left, person=person)
        right = compute_expr(expr.right, person=person)
        if isinstance(expr.op, ast.Mult):
            return left*right
        if isinstance(expr.op, ast.Add):
            return left+right
        if isinstance(expr.op, ast.Sub):
            return left-right
        raise SyntaxError("Unknown operator: %s" % type(expr.op))
    raise SyntaxError("Unknown expr type: %s" % type(expr))

def get_views_from_expr(expr):
    vl = []
    if isinstance(expr, ast.Name):
        if expr.id.startswith('V'):
            vl.append(expr.id[1:])
            return vl
        raise SyntaxError("Unknown name: %s" % expr.id)
    if isinstance(expr, ast.Attribute):
        if not isinstance(expr.value, ast.Name):
            raise SyntaxError("Unknown attribute value: %s" % expr.value)
        if expr.value.id is not "P":
            raise SyntaxError("Unknown attribute value: %s" % expr.value.id)
        if expr.attr is "height":
            return vl
        raise SyntaxError("Unknown attribute: %s" % expr.value.attr)
    if isinstance(expr, ast.Num):
        return vl
    if isinstance(expr, ast.BinOp):
        vl.extend(get_views_from_expr(expr.left))
        vl.extend(get_views_from_expr(expr.right))
        if isinstance(expr.op, (ast.Mult,
                               ast.Add,
                               ast.Sub)):
            return vl
        raise SyntaxError("Unknown operator: %s" % type(expr.op))
    raise SyntaxError("Unknown expr type: %s" % type(expr))

def compile_formula(fs):
    try:
        exp = ast.parse(fs)
    except SyntaxError:
        raise SyntaxError("Could not parse formula: %s" % fs)
    if len(exp.body) is 0:
        raise SyntaxError("Empty formula")
    exp = exp.body[0]
    if not isinstance(exp, ast.Expr):
        raise SyntaxError()
    return exp

def get_formula_views(formula):
    exp = compile_formula(formula)
    return get_views_from_expr(exp.value)


def get_view_dependency_tree(vid=None,view=None):
    if view is None:
        view = View.objects.get(id=vid)
    children = []
    for sv in view.views.all():
        children.append(get_view_dependency_tree(view=sv))
    res = {
      'name': view.name,
      'children': children
    }
    return res
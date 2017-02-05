function extend(target, source)
{
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    for (var propName in source)
    {
        // Invoke hasOwnProperty() with this = source
        if (hasOwnProperty.call(source, propName))
        {
            target[propName] = source[propName];
        }
    }
    return target;
}

inherits = function (child, parent)
{
    var subProto = Object.create(parent.prototype);
    extend(subProto, child.prototype);
    child._super    = parent.prototype;
    child.prototype = subProto;
}

Object.getPropertyByString = function(o, s)
{
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot

    var a = s.split('.');

    for (var i = 0, n = a.length; i < n; ++i)
    {
        var k = a[i];
        if (k in o)
        {
            o = o[k];
        } else
        {
            return;
        }
    }

    return o;
}

function index(obj, s)
{
    if (typeof s == 'string')
    {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        return index(obj, s.split('.'));
    }
    else if (s.length == 1)
    {
        return obj[s[0]];
    } else
    {
      return index(obj[s[0]], s.slice(1));
    }
}

function getCookie(name)
{
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function polygon(x, y, radius, npoints)
{
  var angle = TWO_PI / npoints;

  beginShape();
  for (var a = 0; a < TWO_PI; a += angle)
  {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function chance(probability)
{
  p = constrain(probability, 0, 1);
  return (p < random(0, 1));
}

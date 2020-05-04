---
layout: page
heading: About
permalink: /about/
icon: heart #external-link
type: page
---

* content
{:toc}


## Links
<ul>
    {% for i in site.Links %}
        <li>
            <a href="{{i.link}}" target="_blank">{{i.name}}</a>
        </li>
    {% endfor %}
</ul>



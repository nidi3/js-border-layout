# js-border-layout
A simple [border layout](https://nidi3.github.io/js-border-layout) with CSS and JS.

# Usage
````   
<div class="border-layout">

    <div class="north resizable" size="50px" min-size="10px" max-size="30%">
        <div class="content">
            This is north
        </div>
    </div>

    <div class="west">
        <div class="content">
            This is west
        </div>
    </div>
    
    <div class="east">
        <div class="content">
            This is east
        </div>
    </div>
    
    <div class="south">
        <div class="content">
            This is south
        </div>
    </div>
    
    <div class="center">
        <div class="content">
            And the center
        </div>
    </div>
</div>

<script>
    var layout = borderLayout(document.querySelector('.border-layout'));
</script>
````

# Configuration

The `north`, `east`, `south`, `west`, `center` divs can have 
- `resizable` class to make it resizable by the mouse.
- `size`, `min-size`, `max-size` attributes to define the initial, minimum and maximum size in `px` or `%`.

# API
|Action|Code|
|---|---|
| Initialize the layout | `var layout = borderLayout(domElement, resizeCallback: function(sizes: Sizes))` |
| Resize the sections | `layout.resize(sizes: Sizes)` |
| Hide a section | `layout.hide(section: Section)` |
| Minimize a section | `layout.minimize(section: Section)` |
| Maximize a section | `layout.maximize(section: Section)` |

````
type Sizes = Object{
    north: number
    south: number
    west: number
    east: number
}

type Secion = 'north' | 'south' | 'west' | 'east'
````

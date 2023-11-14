# Notes

## First Notes (GitHub Assignment)

- You can use this `notes.md` file on the exams

## Deliverables

- Deploy the deliverable to your production environment
- Include a link to your GitHub startup repository prominently displayed on your application's home page
- Notes in your startup Git repository README.md file documenting what you modified and added with this deliverable. The
  TAs will only grade things that have been clearly described as being completed. Review the voter app as an example.
  Please reference the items from the rubric for each deliverable in your description of what you did, and what you did
  not.
- Deliverables that do not include the above will not be graded.

### HTML Deliverable

- Default page: index.html
- Header (not head): title, (description?), nav buttons
- Footer: your name, GitHub repo link
- Header and footer should be the same for all pages
- [README.md](https://github.com/ThanGerlek/startup/blob/main/README.md) file: what you've done/not done from the rubric
  items

## Personal Notes

Server IP: `44.206.85.52`

Domain name: `gerleksgarage.click`

### Resources

In-person TAs are located in 1066 TMCB cube
#4 ([TA Schedule](https://docs.google.com/spreadsheets/d/1g1AMtgvyfSwMgp85QcwHuy0mVR-nN3bIGI6XNEJWB1U/edit#gid=0))

Professor Jensen's office hours: 2264 TMCB, Wednesday 9 - 11 AM

[Simon links](https://github.com/webprogramming260/.github/blob/main/profile/essentials/simon/simon.md)

[Deployment script page](https://github.com/webprogramming260/.github/blob/main/profile/essentials/devAndProd/devAndProd.md)

[Common mistakes](https://github.com/webprogramming260/.github/blob/main/profile/essentials/startup/startup.md)

### CSS

#### Selectors

| Combinator Example | Name             | Description                                |
|--------------------|------------------|--------------------------------------------|
| `body section`     | Descendant       | Any section that is a descendant of a body |
| `section > p`      | Direct child     | Any p that is a direct child of a section  |
| `p ~ div`          | sibling          | Any p that has a div sibling               |
| `p + div`          | adjacent sibling | Any p that has an adjacent div sibling     |
| `.summary`         | class            | Any element with class "summary"           |
| `p.summary`        | element w/ class | Any p with class "summary"                 |
| `#physics`         | id               | Any element with id "physics"              |
| `p[class="value"]` | attribute        | Any p with the given HTML attribute        |
| `section:hover`    | pseudo-selector  | Any section being mouse-hovered over       |

#### Common Properties

| Property           | Value                              | Example             | Discussion                                                                     |
|--------------------|------------------------------------|---------------------|--------------------------------------------------------------------------------|
| background-color   | color                              | `red`               | Fill the background color                                                      |
| border             | color width style                  | `#fad solid medium` | Sets the border using shorthand where any or all of the values may be provided |
| border-radius      | unit                               | `20px`              | The size of the border radius                                                  |
| box-shadow         | x-offset y-offset blu-radius color | `2px 2px 2px gray`  | Creates a shadow                                                               |
| columns            | number                             | `3`                 | Number of textual columns                                                      |
| column-rule        | color width style                  | `solid thin black`  | Sets the border used between columns using border shorthand                    |
| color              | color                              | `rgb(128, 0, 0)`    | Sets the text color                                                            |
| cursor             | type                               | `grab`              | Sets the cursor to display when hovering over the element                      |
| display            | type                               | `block`, `inline`   | Defines how to display the element (display:none makes it disappear)           |
| filter             | filter-function                    | `grayscale(30%)`    | Applies a visual filter                                                        |
| float              | direction                          | `right`             | Allows inline text to wrap around it                                           |
| font               | family size style                  | `Arial 1.2em bold`  | Defines the text font using shorthand                                          |
| flex               |                                    |                     | Flex layout. Used for responsive design                                        |
| grid               |                                    |                     | Grid layout. Used for responsive design                                        |
| height             | unit                               | `.25em`             | Sets the height of the box                                                     |
| margin             | unit                               | `5px 5px 0 0`       | Sets the margin spacing                                                        |
| max-[width/height] | unit                               | `20%`               | Restricts maximum width or height (same for min)                               |
| opacity            | number                             | `.9`                | Sets how opaque the element is                                                 |
| overflow           | [visible/hidden/scroll/auto]       | `scroll`            | Defines what happens when the content does not fix in its box                  |
| position           | [static/relative/absolute/sticky]  | `absolute`          | Defines how the element is positioned in the document                          |
| padding            | unit                               | `1em 2em`           | Sets the padding spacing                                                       |
| text-align         | [start/end/center/justify]         | `end`               | Defines how the text is aligned in the element                                 |
| left               | unit                               | `10rem`             | The horizontal value of a positioned element                                   |
| top                | unit                               | `50px`              | The vertical value of a positioned element                                     |
| transform          | transform-function                 | `rotate(0.5turn)`   | Applies a transformation to the element                                        |
| width              | unit                               | `25vmin`            | Sets the width of the box                                                      |
| z-index            | number                             | `100`               | Controls the positioning of the element on the z axis                          |

#### Units

| Unit | Description                                                      |
|------|------------------------------------------------------------------|
| px   | The number of pixels                                             |
| pt   | The number of points (1/72 of an inch)                           |
| in   | The number of inches                                             |
| cm   | The number of centimeters                                        |
| %    | A percentage of the parent element                               |
| em   | A multiplier of the width of the letter `m` in the parent's font |
| rem  | A multiplier of the width of the letter `m` in the root's font   |
| ex   | A multiplier of the height of the element's font                 |
| vw   | A percentage of the viewport's width                             |
| vh   | A percentage of the viewport's height                            |
| vmin | A percentage of the viewport's smaller dimension                 |
| vmax | A percentage of the viewport's larger dimension                  |

`@media` selector: basically just an if-statement for asking about the device you're using.

```css
@media (orientation: portrait) {
  div {
    transform: rotate(270deg);
  }
}
```

#### Animation

```css
p {
  text-align: center;
  font-size: 20vh;

  animation-name: demo;
  animation-duration: 3s;
}

@keyframes demo {
  from {
    font-size: 0vh;
  }
  to {
    font-size: 20vh;
  }
}
```

### HTML

[Common tags](https://github.com/webprogramming260/.github/blob/main/profile/html/introduction/introduction.md)

[Input elements](https://github.com/webprogramming260/.github/blob/main/profile/html/input/input.md)

[Media](https://github.com/webprogramming260/.github/blob/main/profile/html/media/media.md)

### Networking

TLS (transport layer security) protocol: HTTPS's encryption handshake protocol

TCP/IP: a framework (including TCP, UDP, and IP) for creating, sending, and routing data packets. Consists of the four
abstraction layers: application layer (functionality, ex. HTTPS), transport layer (moving data packets, ex. TCP),
internet layer (linking between networks, ex. IP), and link layer (physical connections).

Caddy: gateway (a.k.a. reverse proxy) service. Also handles HTTPS encryption and web certificates. This is how different
subdomains (subdomain.domain.tld (TLD = top level domain)) can map to different HTML files even though the DNS records
on Route53 map all of them to the same IP address.

### AWS

t3.micro: $0.0104 an hour
Route53 root domain: $3/yr
Route53 DNS records: $0.05/mo
Elastic IP address: first one free if the associated instance IS running, if NOT then $0.001/hr

Route53 domain registration: buying a domain name with an official registrar
Route53 DNS records: records that determine how domain names are mapped to IP addresses (or other domain names)

### Console commands

`ssh -i myKeyFileName.pem ubuntu@gerleksgarage.click:myfolder/myfile.html` - Syntax to SSH into server

* `rmdir` - Remove directory
* `curl` - Command line client URL browser
* `grep` - Regular expression search
* `find` - Find files
* `top` - View running processes with CPU and memory usage
* `df` - View disk statistics
* `wc` - Count the words in a file
* `ps` - View the currently running processes
* `kill` - Kill a currently running process
* `history` - Show the history of commands
* `ping` - Check if a website is up
* `tracert` - Trace the connections to a website
* `dig` - Show the DNS information for a domain

`>` - Redirect output to a file. Overwrites the file if it exists
`>>` - Redirect output to a file. Appends if the file exists (like std::cout)

`CTRL-C` - Kill the currently running command

### VIM commands

[Cheat Sheet](https://vim.rtorr.com/)

* `:h`    help
* `i`    enter insert mode
* `u`    undo
* `CTRL-r`    redo
* `gg`    go to beginning of file
* `G`    go to end of file
* `/`    search for text that you type after /
* `n`    next search match
* `N`    previous search match
* `v`    visually select text
* `y`    yank or copy selected text to clipboard
* `p`    paste clipboard
* `CTRL-wv`    Split window vertically
* `CTRL-ww`    Toggle windows
* `CTRL-wq`    Close current window
* `:e`    Open a file. Type ahead available. If you open a directory you can navigate it in the window
* `:w`    write file (save)
* `:q` or `:wq`    quit. Use :q! to exit without saving

## Misc


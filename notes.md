# Notes

## First Notes (GitHub Assignment)

- You can use this `notes.md` file on the exams

## Deliverables

- Deploy the deliverable to your production environment
- Include a link to your GitHub startup repository prominently displayed on your application's home page
- Notes in your startup Git repository README.md file documenting what you modified and added with this deliverable. The TAs will only grade things that have been clearly described as being completed. Review the voter app as an example. Please reference the items from the rubric for each deliverable in your description of what you did, and what you did not.
- Deliverables that do not include the above will not be graded.

### HTML Deliverable

- Default page: index.html
- Header (not head): title, (description?), nav buttons
- Footer: your name, GitHub repo link
- Header and footer should be the same for all pages
- [README.md](https://github.com/ThanGerlek/startup/blob/main/README.md) file: what you've done/not done from the rubric items

## Personal Notes

Server IP: `44.206.85.52`

Domain name: `gerleksgarage.click`

Caddy: gateway (a.k.a. reverse proxy) service. Also handles HTTPS encryption and web certificates. This is how different subdomains (subdomain.domain.tld (TLD = top level domain)) can map to different HTML files even though the DNS records on Route53 map all of them to the same IP address.

### Resources

In-person TAs are located in 1066 TMCB cube #4 ([TA Schedule](https://docs.google.com/spreadsheets/d/1g1AMtgvyfSwMgp85QcwHuy0mVR-nN3bIGI6XNEJWB1U/edit#gid=0))

Professor Jensen's office hours: 2264 TMCB, Wednesday 9 - 11 AM

[Simon links](https://github.com/webprogramming260/.github/blob/main/profile/essentials/simon/simon.md)

[Deployment script page](https://github.com/webprogramming260/.github/blob/main/profile/essentials/devAndProd/devAndProd.md)

[Common mistakes](https://github.com/webprogramming260/.github/blob/main/profile/essentials/startup/startup.md)

### Networking

TLS (transport layer security) protocol: HTTPS's encryption handshake protocol

TCP/IP: a framework (including TCP, UDP, and IP) for creating, sending, and routing data packets. Consists of the four abstraction layers: application layer (functionality, ex. HTTPS), transport layer (moving data packets, ex. TCP), internet layer (linking between networks, ex. IP), and link layer (physical connections).

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

* `:h`	help
* `i`	enter insert mode
* `u`	undo
* `CTRL-r`	redo
* `gg`	go to beginning of file
* `G`	go to end of file
* `/`	search for text that you type after /
* `n`	next search match
* `N`	previous search match
* `v`	visually select text
* `y`	yank or copy selected text to clipboard
* `p`	paste clipboard
* `CTRL-wv`	Split window vertically
* `CTRL-ww`	Toggle windows
* `CTRL-wq`	Close current window
* `:e`	Open a file. Type ahead available. If you open a directory you can navigate it in the window
* `:w`	write file (save)
* `:q` or `:wq`	quit. Use :q! to exit without saving

## Misc


const template = document.createElement("template");
template.innerHTML = 
`
<style>
    p
    {
        color: white;
    }
</style>
<div class="hero-footer padding:100px">
    <p>
        &emsp;&emsp;&emsp;&emsp;&emsp;Hord Blaster | Contact: <a href="mailto:jk9927@g.rit.edu">jk9927@g.rit.edu</a> | <a href="https://www.linkedin.com/in/jonathan-karcher-softwareengineering-development">LinkedIn</a>
    </p>
</div>
`;
class Footer extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({"mode": "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback()
    {}
    disconectedCallback()
    {}
}
customElements.define("df-footer", Footer);
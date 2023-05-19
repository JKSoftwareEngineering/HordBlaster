const template = document.createElement("template");
template.innerHTML = 
`
<h1 class="title">
    Hord Blaster
</h1>
`;
class Header extends HTMLElement
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
customElements.define("df-header", Header);
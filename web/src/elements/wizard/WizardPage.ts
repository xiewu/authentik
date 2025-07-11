import { AKElement } from "#elements/Base";
import { Wizard } from "#elements/wizard/Wizard";

import { CSSResult, html, LitElement, PropertyDeclaration, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import PFBase from "@patternfly/patternfly/patternfly-base.css";

/**
 * Callback for when the page is brought into view.
 */
export type WizardPageActiveCallback = () => void | Promise<void>;

/**
 * Callback for when the next button is pressed.
 *
 * @returns `true` if the wizard can proceed to the next page, `false` otherwise.
 */
export type WizardPageNextCallback = () => boolean | Promise<boolean>;

@customElement("ak-wizard-page")
export abstract class WizardPage extends AKElement {
    static styles: CSSResult[] = [PFBase];

    /**
     * The label to display in the sidebar for this page.
     *
     * Override this to provide a custom label.
     * @todo: Should this be a getter or static property?
     */
    @property()
    public sidebarLabel = (): string => {
        return "UNNAMED";
    };

    public get host(): Wizard {
        return this.parentElement as Wizard;
    }

    /**
     * Reset the page to its initial state.
     *
     * @abstract
     */
    public reset(): void | Promise<void> {
        console.debug(`authentik/wizard ${this.localName}: reset)`);
    }

    /**
     * Called when this is the page brought into view.
     */
    public activeCallback: WizardPageActiveCallback = () => {
        this.host.isValid = false;
    };

    /**
     * Called when the `next` button on the wizard is pressed. For forms, results in the submission
     * of the current form to the back-end before being allowed to proceed to the next page. This is
     * sub-optimal if we want to collect multiple bits of data before finishing the whole course.
     *
     * @returns `true` if the wizard can proceed to the next page, `false` otherwise.
     */
    public abstract nextCallback: WizardPageNextCallback | null;

    public requestUpdate(
        name?: PropertyKey,
        oldValue?: unknown,
        options?: PropertyDeclaration<unknown, unknown>,
    ): void {
        for (const el of this.querySelectorAll("*")) {
            if (el instanceof LitElement) {
                el.requestUpdate();
            }
        }

        return super.requestUpdate(name, oldValue, options);
    }

    public render(): TemplateResult {
        return html`<slot></slot>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-wizard-page": WizardPage;
    }
}

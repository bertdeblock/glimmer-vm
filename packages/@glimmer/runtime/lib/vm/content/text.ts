import { isEmpty, isString } from '../../dom/normalize';
import { Opaque, Simple } from '@glimmer/interfaces';
import { UpdatingOpcode } from '../../opcodes';
import { Tag, VersionedReference, value, validate, Revision } from '@glimmer/reference';

export default class DynamicTextContent extends UpdatingOpcode {
  public type = 'dynamic-text';

  public tag: Tag;
  public lastRevision: Revision;

  constructor(
    public node: Simple.Text,
    private reference: VersionedReference<Opaque>,
    private lastValue: string
  ) {
    super();
    this.tag = reference.tag;
    this.lastRevision = value(this.tag);
  }

  evaluate() {
    let { reference, tag } = this;

    if (!validate(tag, this.lastRevision)) {
      this.lastRevision = value(tag);
      this.update(reference.value());
    }
  }

  update(value: Opaque): void {
    let { lastValue } = this;

    if (value === lastValue) return;

    let normalized: string;

    if (isEmpty(value)) {
      normalized = '';
    } else if (isString(value)) {
      normalized = value;
    } else {
      normalized = String(value);
    }

    if (normalized !== lastValue) {
      let textNode = this.node;
      textNode.nodeValue = this.lastValue = normalized;
    }
  }
}

type ValidationResult = { valid: boolean; message?: string };

type Field = {
  name: string;
  getValue: () => any;
  setValue?: (v: any) => void;
  validate?: () => Promise<ValidationResult> | ValidationResult;
  setError?: (msg?: string) => void;
};

export class FormController {
  private fields = new Map<string, Field>();

  registerField(name: string, field: Field) {
    if (!name) throw new Error('Field must have a name to register with the form');
    this.fields.set(name, field);
    return () => { this.fields.delete(name); };
  }

  getValues() {
    const out: Record<string, any> = {};
    for (const [name, f] of this.fields) {
      out[name] = f.getValue();
    }
    return out;
  }

  setValue(name: string, value: any) {
    const f = this.fields.get(name);
    if (f && typeof f.setValue === 'function') f.setValue(value);
  }

  /** Shows (or with no message clears) an error on a registered field; false when it cannot. */
  setError(name: string, message?: string): boolean {
    const f = this.fields.get(name);
    if (!f || typeof f.setError !== 'function') return false;
    f.setError(message);
    return true;
  }

  async validateField(name: string): Promise<ValidationResult> {
    const f = this.fields.get(name);
    if (!f) return { valid: true };
    if (typeof f.validate === 'function') {
      const res = await f.validate();
      if (f.setError) f.setError(res.valid ? undefined : res.message);
      return res;
    }
    // default: assume valid
    return { valid: true };
  }

  async validateAll(): Promise<{ valid: boolean; errors: Record<string, string | undefined> }> {
    const errors: Record<string, string | undefined> = {};
    let allValid = true;
    const entries = Array.from(this.fields.entries());
    for (const [name, f] of entries) {
      const res = await this.validateField(name);
      if (!res.valid) { allValid = false; errors[name] = res.message || 'invalid'; }
    }
    return { valid: allValid, errors };
  }
}

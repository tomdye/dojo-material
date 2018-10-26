import { Base } from '@dojo/framework/widget-core/meta/Base';

export class Node extends Base {
	public get(key: string | number): any {
		const node = this.getNode(key);
		return node;
	}
}

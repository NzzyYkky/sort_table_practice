import './style.css';

interface APIData {
	id: number;
	name: string;
	username: string;
	email: string;
	phone: string;
	website: string;
}
type SortType = 'id' | 'name' | 'idWithMod3';

class Table {
	table: HTMLTableElement | null;
	data: APIData[] | null;
	originalData: APIData[] | null; // 元のデータを保持
	// 1つのtbodyを作成して保持するプロパティを追加
	tbody: HTMLTableSectionElement;

	constructor() {
		this.table = document.getElementById('table') as HTMLTableElement | null;
		this.data = null;
		this.originalData = null;
		this.tbody = this.#createTableBody();
		this.init();
	}

	#createTableHead() {
		const thead = document.createElement('thead');
		thead.className = 'bg-gray-100';
		const tr = document.createElement('tr');
		tr.append(
			this.#createTableCell('ID'),
			this.#createTableCell('Name'),
			this.#createTableCell('Username'),
			this.#createTableCell('Email'),
			this.#createTableCell('Phone'),
			this.#createTableCell('Website')
		);
		thead.append(tr);
		return thead;
	}

	#createTableBody() {
		const tbody = document.createElement('tbody');
		return tbody;
	}

	#createTableRow(data: APIData) {
		const tr = document.createElement('tr');
		tr.append(
			this.#createTableCell(data.id.toString(), 'th'),
			this.#createTableCell(data.name),
			this.#createTableCell(data.username),
			this.#createTableCell(data.email),
			this.#createTableCell(data.phone),
			this.#createTableCell(data.website)
		);
		return tr;
	}

	#createTableCell(text: string, element: string = 'td') {
		const el = document.createElement(element) as HTMLTableCellElement;
		el.className =
			element === 'th'
				? 'border px-4 py-2 font-bold bg-gray-100'
				: 'border px-4 py-2';
		el.textContent = text;
		return el;
	}

	// 基本的なソートメソッド
	#sortById(data: APIData[], ascending: boolean = true) {
		return [...data].sort((a, b) => {
			return ascending ? a.id - b.id : b.id - a.id;
		});
	}

	// 名前でソート
	#sortByName(data: APIData[], ascending: boolean = true) {
		return [...data].sort((a, b) => {
			return ascending
				? a.name.localeCompare(b.name)
				: b.name.localeCompare(a.name);
		});
	}

	// 3の倍数とその他で分けてソート
	#sortByIdWithMod3(data: APIData[]) {
		const multiplesOf3 = data.filter((item) => item.id % 3 === 0);
		const others = data.filter((item) => item.id % 3 !== 0);

		const sortedMultiplesOf3 = this.#sortById(multiplesOf3, false); // 降順
		const sortedOthers = this.#sortById(others, true); // 昇順

		return [...sortedMultiplesOf3, ...sortedOthers];
	}

	#setupEventListeners() {
		const mod3Checkbox = document.getElementById(
			'js-mod3-filter'
		) as HTMLInputElement;
		const nameCheckbox = document.getElementById(
			'js-name-filter'
		) as HTMLInputElement;

		mod3Checkbox?.addEventListener('change', () => {
			this.#handleSortChange(mod3Checkbox, nameCheckbox);
		});

		nameCheckbox?.addEventListener('change', () => {
			this.#handleSortChange(mod3Checkbox, nameCheckbox);
		});
	}

	#handleSortChange(
		mod3Checkbox: HTMLInputElement,
		nameCheckbox: HTMLInputElement
	) {
		if (!this.data || !this.originalData) return;

		let sortedData = [...this.originalData];

		// Mod3のソートを適用
		if (mod3Checkbox.checked) {
			sortedData = this.#sortByIdWithMod3(sortedData);
		}

		// 名前でのソートを適用
		if (nameCheckbox.checked) {
			sortedData = this.#sortByName(sortedData);
		}

		// データを更新して表示を更新
		this.data = sortedData;
		this.#updateDisplay();
	}

	#updateDisplay() {
		// tbody をクリア
		this.tbody.innerHTML = '';

		// 新しいデータで表示を更新
		this.data?.forEach((item) => {
			this.tbody.append(this.#createTableRow(item));
		});
	}

	init() {
		this.fetch();
		this.#setupEventListeners();
	}

	fetch() {
		fetch('https://jsonplaceholder.typicode.com/users')
			.then((res) => res.json())
			.then((data) => {
				this.originalData = data; // 元のデータを保存
				this.data = [...data]; // コピーを作成
				this.display();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	display() {
		this.#updateDisplay();
		// theadは一度だけ追加
		if (!this.table?.querySelector('thead')) {
			this.table?.append(this.#createTableHead());
		}
		if (!this.table?.querySelector('tbody')) {
			this.table?.append(this.tbody);
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new Table();
});

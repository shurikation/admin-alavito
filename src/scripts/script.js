window.addEventListener('DOMContentLoaded', () => {
	const searchTabsToggler = () => {
		const tabs = document.querySelector('.search-tabs');
		let prevTab = null;
		tabs.addEventListener('click', (e) => {
			if (e.target.tagName !== 'BUTTON') return

			if (prevTab) prevTab.classList.add('collapse');

			const type = e.target.name;
			const workspace = document.querySelector(`[data-name=${type}]`);
			const footer = document.querySelector('.search-footer');

			if (prevTab === workspace) {
				workspace.classList.add('collapse');
				footer.classList.add('collapse');
			} else {
				workspace.classList.remove('collapse');
				footer.classList.remove('collapse')
			}
			prevTab = workspace;
		})
	}
	searchTabsToggler();


});



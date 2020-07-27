format:
	(cd app && npm run lint-fix) && \
	(cd functions && npm run format)
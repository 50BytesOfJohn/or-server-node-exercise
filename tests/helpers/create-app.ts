export const createApp = async () => {
	return (await import("../../src/app.js")).createApp();
};

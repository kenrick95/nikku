module.exports = {
  onPreBuild: async ({ utils: { build, run, status } }) => {
    try {
      if (process.env.CI) {
        await run.command(
          "npx pnpm@10.6.2 i --shamefully-hoist"
        );
      } else {
        status.show({ summary: "CI is false, skipping pnpm install." });
      }

      status.show({ summary: "Installed pnpm!" });
    } catch (e) {
      build.failBuild(`An error occured while installing pnpm: ${e.message}`);
    }
  }
};

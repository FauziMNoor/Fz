'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _appFeatured } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { MotivationIllustration } from 'src/assets/illustrations';

import { svgColorClasses } from 'src/components/svg-color';

import { useMockedUser } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="Ready to write something amazing today? Your words have the power to inspire, educate, and connect with readers around the world."
            img={<MotivationIllustration hideBackground />}
            action={
              <Button
                component={RouterLink}
                href={paths.dashboard.post.new}
                variant="contained"
                color="primary"
              >
                Write New Post
              </Button>
            }
          />
        </Grid>

        {/* Featured/Recent Posts */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        {/* Blog Statistics */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Total Posts"
            percent={12.5}
            total={48}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [3, 5, 4, 8, 6, 7, 9, 6],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Total Views"
            percent={8.2}
            total={24650}
            chart={{
              colors: [theme.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [1200, 1800, 2100, 2800, 3200, 3600, 4200, 5100],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Total Comments"
            percent={5.4}
            total={1284}
            chart={{
              colors: [theme.palette.success.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [80, 120, 150, 180, 160, 200, 220, 174],
            }}
          />
        </Grid>

        {/* Readers by Category */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppCurrentDownload
            title="Posts by Category"
            subheader="Distribution of your content"
            chart={{
              series: [
                { label: 'Technology', value: 18 },
                { label: 'Lifestyle', value: 12 },
                { label: 'Tutorial', value: 10 },
                { label: 'Opinion', value: 8 },
              ],
            }}
          />
        </Grid>

        {/* Monthly Views Trend */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AppAreaInstalled
            title="Monthly Views"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  name: '2023',
                  data: [
                    {
                      name: 'Views',
                      data: [
                        1200, 1400, 1800, 2200, 2000, 1800, 2100, 2400, 2200, 2600, 2800, 3000,
                      ],
                    },
                  ],
                },
                {
                  name: '2024',
                  data: [
                    {
                      name: 'Views',
                      data: [
                        2800, 3200, 3600, 4100, 3800, 4200, 4600, 5100, 4800, 5200, 5600, 6000,
                      ],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        {/* Quick Stats Widgets */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppWidget
              title="Subscribers"
              total={2847}
              icon="solar:users-group-rounded-bold"
              chart={{ series: 72 }}
            />

            <AppWidget
              title="Shares"
              total={1856}
              icon="solar:share-bold"
              chart={{
                series: 58,
                colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
              }}
              sx={{ bgcolor: 'info.dark', [`& .${svgColorClasses.root}`]: { color: 'info.light' } }}
            />
          </Box>
        </Grid>

        {/* Writing Streak / Motivation */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppWidget
              title="Writing Streak"
              total={12}
              icon="solar:fire-bold"
              chart={{
                series: 85,
                colors: [theme.vars.palette.warning.light, theme.vars.palette.warning.main],
              }}
              sx={{
                bgcolor: 'warning.dark',
                [`& .${svgColorClasses.root}`]: { color: 'warning.light' },
              }}
            />

            <AppWidget
              title="Drafts"
              total={5}
              icon="solar:document-text-bold"
              chart={{
                series: 25,
                colors: [theme.vars.palette.secondary.light, theme.vars.palette.secondary.main],
              }}
              sx={{
                bgcolor: 'secondary.dark',
                [`& .${svgColorClasses.root}`]: { color: 'secondary.light' },
              }}
            />
          </Box>
        </Grid>

        {/* Reading Time Stats */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppWidget
              title="Avg. Read Time"
              total={6}
              icon="solar:clock-circle-bold"
              chart={{
                series: 60,
                colors: [theme.vars.palette.success.light, theme.vars.palette.success.main],
              }}
              sx={{
                bgcolor: 'success.dark',
                [`& .${svgColorClasses.root}`]: { color: 'success.light' },
              }}
            />

            <AppWidget
              title="Published This Month"
              total={8}
              icon="solar:calendar-bold"
              chart={{
                series: 40,
                colors: [theme.vars.palette.primary.light, theme.vars.palette.primary.main],
              }}
              sx={{
                bgcolor: 'primary.dark',
                [`& .${svgColorClasses.root}`]: { color: 'primary.light' },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

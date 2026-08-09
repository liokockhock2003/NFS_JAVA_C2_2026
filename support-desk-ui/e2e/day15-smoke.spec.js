import { test, expect } from '@playwright/test';

/*
 * Smoke test: the one path that must always work.
 * Login -> Dashboard -> Tickets -> Ticket Form -> Create -> Success.
 *
 * Needs the Spring Boot backend running on port 8080:
 *   mvn spring-boot:run -Dspring-boot.run.profiles=local
 */

test('admin can log in and create a ticket through the protected UI', async ({ page }) => {
  // A timestamp keeps every run's data unique, so reruns never collide.
  const uniqueSuffix = Date.now();
  const ticketTitle = `E2E ticket ${uniqueSuffix}`;

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Login to Support Desk' })).toBeVisible();

  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('Admin@12345');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/app\/dashboard/);
  await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();

  const mainNav = page.getByRole('navigation', { name: 'Main navigation' });

  await mainNav.getByRole('link', { name: 'Tickets', exact: true }).click();
  await expect(page).toHaveURL(/\/app\/tickets$/);
  await expect(page.getByText('Server pagination and cache controls')).toBeVisible();

  await mainNav.getByRole('link', { name: 'Ticket Form', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Create a new ticket' })).toBeVisible();

  await page.getByLabel('Title').fill(ticketTitle);
  await page.getByLabel('Category').fill('Network');
  await page.getByLabel('Description').fill('Created by the Day 15 smoke test.');
  await page.getByLabel('Priority').selectOption('HIGH');

  await page.getByRole('button', { name: 'Create Ticket' }).click();

  await expect(page.getByText('Ticket created successfully.')).toBeVisible();

  // The ticket list is reachable again after saving.
  await page.getByRole('button', { name: 'View Tickets' }).click();
  await expect(page).toHaveURL(/\/app\/tickets$/);
  await expect(page.getByText('Server pagination and cache controls')).toBeVisible();
});

test('the ticket form blocks submission when required fields are empty', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('Admin@12345');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/app\/dashboard/);

  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Ticket Form', exact: true })
    .click();

  await page.getByRole('button', { name: 'Create Ticket' }).click();

  await expect(page.getByText('Title is required.')).toBeVisible();
  await expect(page.getByText('Description is required.')).toBeVisible();
  await expect(page.getByText('Category is required.')).toBeVisible();
  await expect(page.getByText('Ticket created successfully.')).toHaveCount(0);
});

test('an unauthenticated visitor is redirected from a protected ticket page to login', async ({ page }) => {
  await page.goto('/app/tickets');

  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: 'Login to Support Desk' })).toBeVisible();
});

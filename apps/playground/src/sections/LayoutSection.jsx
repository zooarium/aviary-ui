import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormField,
  Input,
  Select,
} from '@aviary-ui/ui';

function Section({ title, children }) {
  return (
    <section className="mb-5">
      <h3 className="mb-3 border-bottom pb-2">{title}</h3>
      {children}
    </section>
  );
}

export default function LayoutSection() {
  return (
    <>
      <Section title="Card">
        <div className="row row-cards">
          <div className="col-md-4">
            <Card>
              <CardBody>Plain card body.</CardBody>
            </Card>
          </div>
          <div className="col-md-4">
            <Card>
              <CardHeader>
                <CardTitle>With Header</CardTitle>
              </CardHeader>
              <CardBody>Card with header and title.</CardBody>
            </Card>
          </div>
          <div className="col-md-4">
            <Card>
              <CardHeader>
                <CardTitle>No Padding Body</CardTitle>
              </CardHeader>
              <CardBody noPadding>
                <table className="table table-vcenter card-table mb-0">
                  <tbody>
                    <tr><td>Row one</td><td className="text-secondary">value</td></tr>
                    <tr><td>Row two</td><td className="text-secondary">value</td></tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>

      <Section title="FormField / Input / Select">
        <div className="row">
          <div className="col-md-6">
            <Card>
              <CardBody>
                <FormField label="Email" htmlFor="demo-email">
                  <Input id="demo-email" type="email" placeholder="you@example.com" />
                </FormField>
                <FormField label="Password" htmlFor="demo-pass">
                  <Input id="demo-pass" type="password" placeholder="••••••••" />
                </FormField>
                <FormField label="With error" htmlFor="demo-err" error="This field is required.">
                  <Input id="demo-err" type="text" error="This field is required." defaultValue="" />
                </FormField>
                <FormField label="Category" htmlFor="demo-select">
                  <Select id="demo-select">
                    <option value="">Choose…</option>
                    <option value="1">Food</option>
                    <option value="2">Transport</option>
                    <option value="3">Utilities</option>
                  </Select>
                </FormField>
                <FormField label="Select with error" htmlFor="demo-select-err" error="Selection required.">
                  <Select id="demo-select-err" error="Selection required.">
                    <option value="">Choose…</option>
                  </Select>
                </FormField>
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          <p>
            Data sources:{' '}
            <a
              href="https://carbonintensity.org.uk/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              National Grid ESO
            </a>
            {' · '}
            <a
              href="https://environment.data.gov.uk/flood-monitoring/doc/reference"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Environment Agency
            </a>
            {' · '}
            <a
              href="https://uk-air.defra.gov.uk/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              DEFRA UK-AIR
            </a>
            {' · '}
            <a
              href="https://data.police.uk/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Police.uk
            </a>
            {' · '}
            <a
              href="https://www.planning.data.gov.uk/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Planning Data
            </a>
            {' · '}
            <a
              href="https://open-meteo.com/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open-Meteo
            </a>
            {' · '}
            <a
              href="https://environment.data.gov.uk/bwq/profiles/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              EA Bathing Water
            </a>
          </p>
          <p>
            Contains public sector information licensed under the{' '}
            <a
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Government Licence v3.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
